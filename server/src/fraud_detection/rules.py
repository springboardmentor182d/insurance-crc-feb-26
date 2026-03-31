def check_claim_amount(amount):
    """
    Fraud Rule:
    Categorize claim based on amount
    """

    if amount > 10000:
        return {
            "rule_code": "HIGH_CLAIM_AMOUNT",
            "severity": "high",
            "details": f"Claim amount {amount} is very high"
        }

    elif amount > 5000:
        return {
            "rule_code": "MEDIUM_CLAIM_AMOUNT",
            "severity": "medium",
            "details": f"Claim amount {amount} is moderately high"
        }

    elif amount > 0:
        return {
            "rule_code": "LOW_CLAIM_AMOUNT",
            "severity": "low",
            "details": f"Claim amount {amount} is normal"
        }

    return None