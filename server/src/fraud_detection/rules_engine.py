from sqlalchemy.orm import Session
from src.fraud_detection.models import FraudRule


def evaluate_rules(claim_data: dict, db: Session):
    rules = db.query(FraudRule).filter(FraudRule.status == "ACTIVE").all()

    triggered_rules = []

    for rule in rules:

        field = rule.field_name
        operator = rule.operator
        value = rule.rule_value

        claim_value = claim_data.get(field)

        if claim_value is None:
            continue

        triggered = False

        try:
            # 👉 HANDLE NUMERIC OPERATORS (>, <)
            if operator in [">", "<"]:
                try:
                    claim_val = float(claim_value)
                    rule_val = float(value)
                except:
                    continue  # skip non-numeric rules

                if operator == ">":
                    triggered = claim_val > rule_val

                elif operator == "<":
                    triggered = claim_val < rule_val

            # 👉 HANDLE EQUALITY (=)
            elif operator == "=":
                triggered = str(claim_value).lower() == str(value).lower()

        except Exception as e:
            print("Rule Error:", e)
            continue

        if triggered:
            triggered_rules.append(rule)

    # 🔥 NO RULE TRIGGERED
    if not triggered_rules:
        return {
            "rule_triggered": "No Rule Triggered",
            "severity": "low",
            "recommendation": "Normal Case"
        }

    # 🔥 PICK HIGHEST SEVERITY
    priority = {"high": 3, "medium": 2, "low": 1}

    best_rule = max(triggered_rules, key=lambda r: priority.get(r.severity.lower(), 0))

    return {
        "rule_triggered": best_rule.rule_name,
        "severity": best_rule.severity.lower(),
        "recommendation": best_rule.recommendation
    }