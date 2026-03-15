from src.schemas import PolicyCreate, RecommendationCreate


def test_policy_schema_defaults_are_applied():
	policy = PolicyCreate(
		name="Health Shield",
		provider="SecureCare",
		policy_type="Health",
		coverage="₹5.0L",
		premium="₹15,000/yr",
	)

	assert policy.claim_ratio == "0%"
	assert policy.is_active is True


def test_recommendation_schema_serialization():
	recommendation = RecommendationCreate(
		category="Health",
		title="Health Shield",
		provider="SecureCare",
		match_score=92.0,
		coverage="₹5.0L",
		premium="₹15,000/yr",
	)

	data = recommendation.model_dump()
	assert data["category"] == "Health"
	assert data["is_active"] is True
