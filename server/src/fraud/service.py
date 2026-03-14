fraud_cases = [

{
"case_id": "FD-8734",
"claim_id": "CL-8734",
"policy_id": "POL-2345",
"claimant": "Marcus Thompson",
"amount": 15800,
"risk_level": "Critical",
"confidence": 92,
"rules": "Excessive Claim Amount, Rapid Policy-Claim Pattern",
"status": "Under Review"
},

{
"case_id": "FD-8729",
"claim_id": "CL-8729",
"policy_id": "POL-2298",
"claimant": "Rachel Cooper",
"amount": 8400,
"risk_level": "High",
"confidence": 78,
"rules": "Multiple Claims Same Period, Duplicate Document Submission",
"status": "Under Review"
},

{
"case_id": "FD-8721",
"claim_id": "CL-8721",
"policy_id": "POL-2267",
"claimant": "Kevin Martinez",
"amount": 12300,
"risk_level": "Critical",
"confidence": 95,
"rules": "Identity Verification Failure, Duplicate Document Submission",
"status": "Confirmed Fraud"
},

{
"case_id": "FD-8715",
"claim_id": "CL-8715",
"policy_id": "POL-2234",
"claimant": "Angela Robinson",
"amount": 5600,
"risk_level": "Medium",
"confidence": 64,
"rules": "Multiple Claims Same Period",
"status": "Under Review"
},

{
"case_id": "FD-8708",
"claim_id": "CL-8708",
"policy_id": "POL-2189",
"claimant": "Daniel Hayes",
"amount": 7200,
"risk_level": "High",
"confidence": 71,
"rules": "Rapid Policy-Claim Pattern",
"status": "Dismissed"
},
{
"case_id": "FD-8701",
"claim_id": "CL-8701",
"policy_id": "POL-2156",
"claimant": "Patricia Sullivan",
"amount": 18900,
"risk_level": "Critical",
"confidence": 98,
"rules": "Excessive Claim Amount ,Multiple Claims Same Period",
"status": "Confirmed Fraud"
},
{
"case_id": "FD-8695",
"claim_id": "CL-8695",
"policy_id": "POL-2123",
"claimant": "Brian Foster",
"amount": 4800,
"risk_level": "Medium",
"confidence": 58,
"rules": "Duplicate Document Submission",
"status": "Under Review"
}
]


detection_rules = [
     {
        "rule_id": "FR-001",
        "rule_name": "Multiple Claims Same Period",
        "description": "Flags claims when user submits more than 3 claims in 30 days",
        "severity": "High",
        "detections": 24,
        "created_date": "2024-01-15",
        "status": "Active"
    },
    {
        "rule_id": "FR-002",
        "rule_name": "Excessive Claim Amount",
        "description": "Flags claims exceeding 80% of policy coverage limit",
        "severity": "Critical",
        "detections": 18,
        "created_date": "2024-01-20",
        "status": "Active"
    },
    {
        "rule_id": "FR-003",
        "rule_name": "Rapid Policy Claim Pattern",
        "description": "Flags claims submitted within 7 days of policy activation",
        "severity": "High",
        "detections": 31,
        "created_date": "2024-02-01",
        "status": "Active"
    },
    {
        "rule_id": "FR-004",
        "rule_name": "Duplicate Document Submission",
        "description": "Detects when same document is used across multiple claims",
        "severity": "Medium",
        "detections": 12,
        "created_date": "2024-02-05",
        "status": "Active"
    },
    {
        "rule_id": "FR-005",
        "rule_name": "Suspicious Location Pattern",
        "description": "Flags claims from high-risk geographic locations",
        "severity": "Medium",
        "detections": 8,
        "created_date": "2023-12-10",
        "status": "Inactive"
    },
    {
        "rule_id": "FR-006",
        "rule_name": "Identity Verification Failure",
        "description": "Flags claims when identity documents fail verification",
        "severity": "Critical",
        "detections": 6,
        "created_date": "2024-01-25",
        "status": "Inactive"
    }
]


def get_fraud_cases():
    return fraud_cases


def get_detection_rules():
    return detection_rules



def create_rule(rule):
    new_rule = {
        "rule_id": rule.rule_id,
        "rule_name": rule.rule_name,
        "description": rule.description,
        "severity": rule.severity,
        "detections": 0,
        "created_date": rule.created_date,
        "status": "Active"
    }

    detection_rules.append(new_rule)

    return {
        "message": "Rule created successfully",
        "data": new_rule
    }