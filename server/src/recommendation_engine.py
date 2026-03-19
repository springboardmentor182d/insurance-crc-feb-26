from typing import List
from src.database.policies_data import policies

def calculate_match(user_age: int, budget: int, policy):
    score = 0

    # Budget matching
    if policy.premium <= budget:
        score += 40

    # Coverage preference
    if policy.coverage >= 500000:
        score += 30

    # Claim ratio
    score += int(policy.claim_ratio * 30)

    return min(score, 100)

def risk_level(policy):
    if policy.claim_ratio >= 0.95:
        return "Low Risk"
    elif policy.claim_ratio >= 0.90:
        return "Medium Risk"
    else:
        return "High Risk"

def analyze_policies(user_age: int, budget: int):
    results = []

    for policy in policies:
        match = calculate_match(user_age, budget, policy)

        results.append({
            "id": policy.id,
            "category": policy.category,
            "title": policy.title,
            "provider": policy.provider,
            "coverage": f"₹{policy.coverage/100000:.1f}L",
            "premium": f"₹{policy.premium}",
            "claimRatio": f"{int(policy.claim_ratio*100)}%",
            "risk": risk_level(policy),
            "match": match,
            "why": "Best match based on budget & claim ratio",
            "features": policy.features
        })

    results.sort(key=lambda x: x["match"], reverse=True)

    return results