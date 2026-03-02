from enum import Enum


class ActivitySeverity(str, Enum):
    INFO = "info"
    APPROVED = "approved"
    FLAGGED = "flagged"
    FRAUD = "fraud"
    WARNING = "warning"
    ERROR = "error"


class ActivityType(str, Enum):
    POLICY_CREATED = "policy_created"
    CLAIM_SUBMITTED = "claim_submitted"
    CLAIM_APPROVED = "claim_approved"
    CLAIM_REJECTED = "claim_rejected"
    FRAUD_RULE_ACTIVATED = "fraud_rule_activated"
    SYSTEM_EVENT = "system_event"
