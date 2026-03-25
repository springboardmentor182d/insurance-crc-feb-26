from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from src.database.core import get_db

router = APIRouter()


def _to_int(value: object) -> int:
	try:
		if value is None:
			return 0
		return int(value)
	except (TypeError, ValueError):
		return 0


@router.get("/dashboard")
def get_user_dashboard(db: Session = Depends(get_db)) -> dict:
	policy_rows = db.execute(
		text(
			"""
			SELECT id, name, is_active
			FROM policies
			ORDER BY id DESC
			"""
		)
	).mappings().all()

	claim_rows = db.execute(
		text(
			"""
			SELECT id, status, created_at
			FROM claims
			ORDER BY created_at DESC
			"""
		)
	).mappings().all()

	active_plans = sum(1 for row in policy_rows if bool(row.get("is_active")))
	pending_claims = sum(
		1
		for row in claim_rows
		if str(row.get("status") or "").lower() in {"pending", "under review", "submitted"}
	)

	recent_activity = [
		{
			"id": f"claim-{row.get('id')}",
			"text": f"Claim #{_to_int(row.get('id'))} status: {row.get('status') or 'pending'}",
		}
		for row in claim_rows[:5]
	]

	return {
		"summary": {
			"active_plans": active_plans,
			"claims_status": pending_claims,
			"recommended_policies": max(3, len(policy_rows)),
			"recent_activity_count": len(recent_activity),
		},
		"recent_activity": recent_activity,
		"compare": {
			"selected_policies_count": 0,
			"can_browse": True,
		},
		"active_plan": {
			"active_plans": active_plans,
			"has_active_policies": active_plans > 0,
		},
	}
