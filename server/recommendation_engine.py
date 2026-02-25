from models import UserProfile, Recommendation
from database import POLICIES


def calculate_match_score(user: UserProfile, category: str):
    score = 50

    if category not in user.current_coverage:
        score += 30

    if user.age < 40:
        score += 10

    if user.annual_income > 75000:
        score += 10

    return min(score, 98)


def generate_recommendations(user: UserProfile):

    recommendations = []

    for policy in POLICIES:

        match_score = calculate_match_score(user, policy.category)

        title_map = {
            "health": "Health Insurance Coverage Gap",
            "auto": "Save on Auto Insurance",
            "life": "Increase Life Insurance Coverage",
            "disability": "Consider Disability Insurance"
        }

        description_map = {
            "health": "You currently do not have health insurance.",
            "auto": "We found potential savings on your auto policy.",
            "life": "Your current life coverage may be insufficient.",
            "disability": "Protect your income from unexpected disability."
        }

        reasons_map = {
            "health": [
                "Age-appropriate coverage",
                "Includes preventive care",
                "Covers pre-existing conditions"
            ],
            "auto": [
                "Same coverage limits",
                "Better claim rating",
                "Includes roadside assistance"
            ],
            "life": [
                "Matches 10x annual income rule",
                "Premium guaranteed",
                "Living benefits included"
            ],
            "disability": [
                "Covers 60% of income",
                "Short & long-term options",
                "Tax-free benefits"
            ]
        }

        recommendations.append(
            Recommendation(
                match_score=match_score,
                category=policy.category,
                title=title_map[policy.category],
                description=description_map[policy.category],
                policy=policy,
                reasons=reasons_map[policy.category]
            )
        )

    # Sort by highest match
    recommendations.sort(key=lambda x: x.match_score, reverse=True)

    return recommendations