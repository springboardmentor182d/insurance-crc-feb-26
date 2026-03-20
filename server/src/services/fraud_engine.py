from __future__ import annotations

from dataclasses import dataclass
from datetime import timedelta
from difflib import SequenceMatcher
from typing import Callable

from sqlalchemy import func, select, update
from sqlalchemy.orm import Session

from src.database.admin_dashboard.enums.activity import ActivitySeverity, ActivityType
from src.database.admin_dashboard.models import (
    ActivityLog,
    Claim,
    ClaimStatus,
    FraudFlag,
    FraudRule,
    FraudSeverity,
    Policy,
)
from src.tasks.fraud_notifications import notify_admin_high_severity_flag


@dataclass
class RuleCheckResult:
    triggered: bool
    details: str | None = None


def compute_fraud_score(flags: list[FraudFlag]) -> float:
    weights = {"high": 0.40, "medium": 0.25, "low": 0.15}
    raw = sum(weights.get(flag.severity.value, 0.0) for flag in flags)
    return round(min(raw, 0.99), 2)


def _check_duplicate_claim(
    claim: Claim, rule: FraudRule, db: Session
) -> RuleCheckResult:
    if not claim.description:
        return RuleCheckResult(False)

    start_window = claim.submitted_at - timedelta(days=90)

    stmt = (
        select(Claim)
        .where(
            Claim.id != claim.id,
            Claim.user_id == claim.user_id,
            Claim.policy_id == claim.policy_id,
            Claim.submitted_at >= start_window,
        )
        .order_by(Claim.submitted_at.desc())
    )
    candidates = db.execute(stmt).scalars().all()

    for other in candidates:
        if not other.description:
            continue
        ratio = SequenceMatcher(
            None, claim.description.lower(), other.description.lower()
        ).ratio()
        if ratio >= 0.7:
            return RuleCheckResult(
                True,
                (
                    "Similar claim detected within 90 days "
                    f"(claim_id={other.id}, similarity={ratio:.2f})."
                ),
            )

    return RuleCheckResult(False)


def _check_excessive_amount(
    claim: Claim, rule: FraudRule, db: Session
) -> RuleCheckResult:
    threshold = rule.trigger_threshold or 3.0
    if not claim.policy:
        return RuleCheckResult(False)

    avg_stmt = (
        select(func.avg(Claim.approved_amount))
        .select_from(Claim)
        .join(Policy, Claim.policy_id == Policy.id)
        .where(
            Claim.approved_amount.is_not(None),
            Claim.status == ClaimStatus.APPROVED,
            Policy.policy_type == claim.policy.policy_type,
        )
    )
    avg_amount = db.execute(avg_stmt).scalar_one_or_none()
    if not avg_amount:
        return RuleCheckResult(False)

    claim_amount = float(claim.claim_amount)
    avg_value = float(avg_amount)
    if claim_amount > threshold * avg_value:
        return RuleCheckResult(
            True,
            (
                f"Claim amount {claim_amount:.2f} exceeds "
                f"{threshold:.2f}x average approved amount {avg_value:.2f} "
                f"for {claim.policy.policy_type.value} policies."
            ),
        )

    return RuleCheckResult(False)


def _check_rapid_policy_claim(
    claim: Claim, rule: FraudRule, db: Session
) -> RuleCheckResult:
    if not claim.policy:
        return RuleCheckResult(False)
    threshold_days = int(rule.trigger_threshold or 30)
    delta_days = (claim.submitted_at.date() - claim.policy.start_date).days
    if delta_days <= threshold_days:
        return RuleCheckResult(
            True,
            f"Claim submitted {delta_days} days after policy start date.",
        )
    return RuleCheckResult(False)


def _check_multiple_claims_short_period(
    claim: Claim, rule: FraudRule, db: Session
) -> RuleCheckResult:
    threshold = int(rule.trigger_threshold or 2)
    start_window = claim.submitted_at - timedelta(days=60)

    count_stmt = select(func.count()).select_from(Claim).where(
        Claim.user_id == claim.user_id,
        Claim.submitted_at >= start_window,
        Claim.submitted_at <= claim.submitted_at,
    )
    claim_count = int(db.execute(count_stmt).scalar_one())

    if claim_count > threshold:
        return RuleCheckResult(
            True,
            (
                f"User has {claim_count} claims within 60 days "
                f"(threshold {threshold})."
            ),
        )
    return RuleCheckResult(False)


def _check_suspicious_timing(
    claim: Claim, rule: FraudRule, db: Session
) -> RuleCheckResult:
    threshold = rule.trigger_threshold or 50000.0
    weekend = claim.submitted_at.weekday() >= 5
    claim_amount = float(claim.claim_amount)
    if weekend and claim_amount > threshold:
        return RuleCheckResult(
            True,
            (
                "Weekend claim submitted with amount "
                f"{claim_amount:.2f} above {threshold:.2f}."
            ),
        )
    return RuleCheckResult(False)


def _check_duplicate_documents(
    claim: Claim, rule: FraudRule, db: Session
) -> RuleCheckResult:
    db.add(
        ActivityLog(
            user_id=None,
            title="Fraud rule skipped: DUPLICATE_DOCUMENTS",
            action_type=ActivityType.SYSTEM_EVENT,
            severity=ActivitySeverity.INFO,
            details="Document table not available; rule pending future implementation.",
            entity_type="claim",
            entity_id=claim.id,
        )
    )
    return RuleCheckResult(False)


def _check_low_fraud_score_override(
    claim: Claim, rule: FraudRule, db: Session
) -> RuleCheckResult:
    threshold = rule.trigger_threshold or 0.7
    if claim.fraud_score is not None and claim.fraud_score > threshold:
        return RuleCheckResult(
            True,
            (
                f"Pre-existing fraud score {claim.fraud_score:.2f} exceeds "
                f"threshold {threshold:.2f}."
            ),
        )
    return RuleCheckResult(False)


RULE_HANDLERS: dict[str, Callable[[Claim, FraudRule, Session], RuleCheckResult]] = {
    "DUPLICATE_CLAIM": _check_duplicate_claim,
    "EXCESSIVE_AMOUNT": _check_excessive_amount,
    "RAPID_POLICY_CLAIM": _check_rapid_policy_claim,
    "MULTIPLE_CLAIMS_SHORT_PERIOD": _check_multiple_claims_short_period,
    "SUSPICIOUS_TIMING": _check_suspicious_timing,
    "DUPLICATE_DOCUMENTS": _check_duplicate_documents,
    "LOW_FRAUD_SCORE_OVERRIDE": _check_low_fraud_score_override,
}


def run_fraud_checks(claim_id: int, db: Session) -> list[FraudFlag]:
    claim_stmt = select(Claim).where(Claim.id == claim_id)
    claim = db.execute(claim_stmt).scalar_one_or_none()
    if not claim:
        return []

    policy = db.get(Policy, claim.policy_id)
    if policy:
        claim.policy = policy

    rules_stmt = select(FraudRule).where(FraudRule.is_active.is_(True))
    rules = db.execute(rules_stmt).scalars().all()

    created_flags: list[FraudFlag] = []

    for rule in rules:
        handler = RULE_HANDLERS.get(rule.rule_name)
        if not handler:
            continue

        result = handler(claim, rule, db)
        if not result.triggered:
            continue

        flag = FraudFlag(
            claim_id=claim.id,
            rule_id=rule.id,
            rule_name=rule.rule_name,
            severity=rule.severity,
            details=result.details,
        )
        db.add(flag)
        created_flags.append(flag)

        db.execute(
            update(FraudRule)
            .where(FraudRule.id == rule.id)
            .values(trigger_count=FraudRule.trigger_count + 1)
        )

        db.add(
            ActivityLog(
                user_id=None,
                title=(
                    f"Fraud rule triggered: {rule.rule_name} "
                    f"on claim {claim.claim_number}"
                ),
                action_type=ActivityType.FRAUD_RULE_ACTIVATED,
                severity=(
                    ActivitySeverity.FRAUD
                    if rule.severity == FraudSeverity.HIGH
                    else ActivitySeverity.FLAGGED
                ),
                details=result.details,
                entity_type="claim",
                entity_id=claim.id,
            )
        )

        if rule.severity == FraudSeverity.HIGH:
            notify_admin_high_severity_flag.delay(
                claim.id, rule.rule_name, claim.claim_number
            )

    db.flush()

    all_flags = db.execute(
        select(FraudFlag).where(FraudFlag.claim_id == claim.id)
    ).scalars().all()
    fraud_score = compute_fraud_score(all_flags)

    db.execute(
        update(Claim)
        .where(Claim.id == claim.id)
        .values(
            fraud_score=fraud_score,
            status=(
                ClaimStatus.FRAUDULENT
                if fraud_score >= 0.80
                else claim.status
            ),
        )
    )

    db.commit()
    return created_flags
