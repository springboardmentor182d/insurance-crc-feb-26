from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import database
from .. import models
from .. import schemas

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("", include_in_schema=False)
def admin_root():
    return {
        "message": "Admin API is running. Use /admin/overview, /admin/users, /admin/fraud-rules, /admin/analytics",
    }


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ============================================
# OVERVIEW ENDPOINT
# ============================================
@router.get("/overview", response_model=schemas.OverviewStats)
def get_overview(db: Session = Depends(get_db)):
    """Get overview statistics for admin dashboard"""
    try:
        # Total users with insurance policies
        total_users = db.query(models.User).count()
        
        # Active policies from policies table
        active_policies = db.query(models.Policy).filter(models.Policy.is_active == True).count()
        
        # Total claims submitted
        total_claims = db.query(models.Claim).count()
        
        # High-risk claims (Under Review or Rejected status)
        high_risk_claims = db.query(models.Claim).filter(
            models.Claim.status.in_(["Under Review", "Rejected"])
        ).count()

        return {
            "total_users": total_users,
            "active_policies": active_policies,
            "claims": total_claims,
            "fraud_alerts": high_risk_claims,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching overview: {str(e)}",
        )


# ============================================
# USER ENDPOINTS
# ============================================
@router.get("/users", response_model=List[schemas.UserResponse])
def get_users(db: Session = Depends(get_db)):
    """Get all users"""
    try:
        users = db.query(models.User).all()
        return users
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching users: {str(e)}",
        )


@router.post("/users", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Create a new user"""
    try:
        # Check if user with email already exists
        existing_user = db.query(models.User).filter(models.User.email == user.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists",
            )

        db_user = models.User(
            full_name=user.name,
            email=user.email,
            password_hash="",
            is_active=True,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating user: {str(e)}",
        )


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """Delete a user by ID"""
    try:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        db.delete(user)
        db.commit()
        return None
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting user: {str(e)}",
        )


@router.put("/users/{user_id}/toggle-status", response_model=schemas.UserResponse)
def toggle_user_status(user_id: int, db: Session = Depends(get_db)):
    """Toggle user status between Active and Inactive"""
    try:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        user.status = "Inactive" if user.status == "Active" else "Active"
        db.commit()
        db.refresh(user)
        return user
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error toggling user status: {str(e)}",
        )


# ============================================
# FRAUD RULE ENDPOINTS
# ============================================
@router.get("/fraud-rules", response_model=List[schemas.FraudRuleResponse])
def get_fraud_rules(db: Session = Depends(get_db)):
    """Get all fraud rules"""
    try:
        rules = db.query(models.FraudRule).all()
        return rules
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching fraud rules: {str(e)}",
        )


@router.post("/fraud-rules", response_model=schemas.FraudRuleResponse, status_code=status.HTTP_201_CREATED)
def create_fraud_rule(rule: schemas.FraudRuleCreate, db: Session = Depends(get_db)):
    """Create a new fraud rule"""
    try:
        db_rule = models.FraudRule(
            name=rule.name,
            condition=rule.description,
            severity=rule.priority or "Medium",
            is_active=(rule.status or "Active") == "Active",
        )
        db.add(db_rule)
        db.commit()
        db.refresh(db_rule)
        return db_rule
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating fraud rule: {str(e)}",
        )


@router.put("/fraud-rules/{rule_id}", response_model=schemas.FraudRuleResponse)
def update_fraud_rule(rule_id: int, rule_update: schemas.FraudRuleUpdate, db: Session = Depends(get_db)):
    """Update a fraud rule by ID"""
    try:
        rule = db.query(models.FraudRule).filter(models.FraudRule.id == rule_id).first()
        if not rule:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Fraud rule not found",
            )

        update_data = rule_update.model_dump(exclude_unset=True)
        if "name" in update_data:
            rule.name = update_data["name"]
        if "description" in update_data:
            rule.condition = update_data["description"]
        if "priority" in update_data:
            rule.severity = update_data["priority"]
        if "status" in update_data:
            rule.is_active = str(update_data["status"]).lower() == "active"

        db.commit()
        db.refresh(rule)
        return rule
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating fraud rule: {str(e)}",
        )


@router.put("/fraud-rules/{rule_id}/toggle-status", response_model=schemas.FraudRuleResponse)
def toggle_fraud_rule_status(rule_id: int, db: Session = Depends(get_db)):
    """Toggle fraud rule status between Active and Inactive"""
    try:
        rule = db.query(models.FraudRule).filter(models.FraudRule.id == rule_id).first()
        if not rule:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Fraud rule not found",
            )

        rule.is_active = not rule.is_active
        db.commit()
        db.refresh(rule)
        return rule
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error toggling fraud rule status: {str(e)}",
        )


@router.delete("/fraud-rules/{rule_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_fraud_rule(rule_id: int, db: Session = Depends(get_db)):
    """Delete a fraud rule by ID"""
    try:
        rule = db.query(models.FraudRule).filter(models.FraudRule.id == rule_id).first()
        if not rule:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Fraud rule not found",
            )

        db.delete(rule)
        db.commit()
        return None
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting fraud rule: {str(e)}",
        )


# ============================================
# CLAIMS ENDPOINT
# ============================================
@router.get("/claims", response_model=List[schemas.ClaimResponse])
def get_claims(db: Session = Depends(get_db)):
    """Get all claims"""
    try:
        claims = db.query(models.Claim).all()
        return claims
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching claims: {str(e)}",
        )


@router.post("/claims", response_model=schemas.ClaimResponse, status_code=status.HTTP_201_CREATED)
def create_claim(claim: schemas.ClaimCreate, db: Session = Depends(get_db)):
    """Create a new claim"""
    try:
        amount_value = claim.amount
        if isinstance(amount_value, str):
            amount_value = amount_value.replace("₹", "").replace(",", "")
        db_claim = models.Claim(
            claim_type=claim.claim_type,
            amount=float(amount_value),
            status=claim.status,
            risk_level=claim.priority,
        )
        db.add(db_claim)
        db.commit()
        db.refresh(db_claim)
        return db_claim
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating claim: {str(e)}",
        )


@router.delete("/claims/{claim_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_claim(claim_id: int, db: Session = Depends(get_db)):
    """Delete a claim by ID"""
    try:
        claim = db.query(models.Claim).filter(models.Claim.id == claim_id).first()
        if not claim:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Claim not found",
            )

        db.delete(claim)
        db.commit()
        return None
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting claim: {str(e)}",
        )


# ============================================
# ANALYTICS ENDPOINT
# ============================================
@router.get("/analytics/comprehensive", response_model=schemas.ComprehensiveAnalytics)
def get_comprehensive_analytics(db: Session = Depends(get_db)):
    """Get comprehensive analytics calculated from actual claims data"""
    try:
        all_claims = db.query(models.Claim).all()
        
        if not all_claims:
            # Return zeros if no claims
            return {
                "total_claims": 0,
                "approved_claims": 0,
                "pending_claims": 0,
                "rejected_claims": 0,
                "under_review_claims": 0,
                "average_claim_amount": 0,
                "approval_rate": 0,
                "fraud_rate": 0,
                "claims_by_type": {},
                "claims_by_priority": {}
            }
        
        # Calculate statistics
        total_claims = len(all_claims)
        approved_claims = sum(1 for c in all_claims if c.status == "Approved")
        pending_claims = sum(1 for c in all_claims if c.status == "Pending")
        rejected_claims = sum(1 for c in all_claims if c.status == "Rejected")
        under_review_claims = sum(1 for c in all_claims if c.status == "Under Review")
        
        amounts = [float(c.amount) for c in all_claims if c.amount is not None]
        average_amount = sum(amounts) / len(amounts) if amounts else 0
        
        # Calculate rates
        approval_rate = (approved_claims / total_claims * 100) if total_claims > 0 else 0
        fraud_rate = (rejected_claims / total_claims * 100) if total_claims > 0 else 0
        
        # Distribution by type
        claims_by_type = {}
        for claim in all_claims:
            claim_type = claim.claim_type
            claims_by_type[claim_type] = claims_by_type.get(claim_type, 0) + 1
        
        # Distribution by priority
        claims_by_priority = {}
        for claim in all_claims:
            priority = claim.risk_level
            claims_by_priority[priority] = claims_by_priority.get(priority, 0) + 1
        
        return {
            "total_claims": total_claims,
            "approved_claims": approved_claims,
            "pending_claims": pending_claims,
            "rejected_claims": rejected_claims,
            "under_review_claims": under_review_claims,
            "average_claim_amount": round(average_amount, 2),
            "approval_rate": round(approval_rate, 2),
            "fraud_rate": round(fraud_rate, 2),
            "claims_by_type": claims_by_type,
            "claims_by_priority": claims_by_priority
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching comprehensive analytics: {str(e)}",
        )


@router.get("/analytics", response_model=List[schemas.ClaimStatsResponse])
def get_analytics(db: Session = Depends(get_db)):
    """Get analytics data for claims per month"""
    try:
        stats = db.query(models.ClaimStats).all()
        return stats
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching analytics: {str(e)}",
        )


@router.get("/quick-stats")
def get_quick_stats(db: Session = Depends(get_db)):
    """Get quick stats for dashboard with real data"""
    try:
        all_claims = db.query(models.Claim).all()
        
        if not all_claims:
            return {
                "approval_rate": 0,
                "avg_processing_time": 0,
                "customer_satisfaction": 0
            }
        
        # Calculate Approval Rate
        total_claims = len(all_claims)
        approved_claims = sum(1 for c in all_claims if c.status == "Approved")
        approval_rate = (approved_claims / total_claims * 100) if total_claims > 0 else 0
        
        # Calculate Average Processing Time (in days) from created_at
        from datetime import datetime
        
        processing_times = []
        for claim in all_claims:
            try:
                claim_date = claim.created_at
                current_date = datetime.now()
                days_to_process = (current_date - claim_date).days
                if days_to_process > 0:
                    processing_times.append(days_to_process)
            except:
                pass
        
        avg_processing_time = sum(processing_times) / len(processing_times) if processing_times else 3.5
        
        # Calculate Customer Satisfaction (derived from approval rate and claim health)
        # Formula: (Approval Rate * 0.7) + (Low Rejection Rate * 0.3) normalized to 5 scale
        rejection_rate = ((total_claims - approved_claims) / total_claims * 100) if total_claims > 0 else 0
        satisfaction_score = ((approval_rate * 0.7 + (100 - rejection_rate) * 0.3) / 100) * 5
        customer_satisfaction = round(satisfaction_score, 1)
        
        return {
            "approval_rate": round(approval_rate, 1),
            "avg_processing_time": round(avg_processing_time, 1),
            "customer_satisfaction": customer_satisfaction
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error calculating quick stats: {str(e)}",
        )


@router.get("/system-alerts")
def get_system_alerts(db: Session = Depends(get_db)):
    """Get real-time system alerts based on actual database data"""
    try:
        all_claims = db.query(models.Claim).all()
        
        alerts = []
        
        # High Priority Alert: High-Risk Claims Pending Review
        under_review_claims = sum(1 for c in all_claims if c.status == "Under Review")
        rejected_claims = sum(1 for c in all_claims if c.status == "Rejected")
        high_risk_count = under_review_claims + rejected_claims
        
        if high_risk_count > 0:
            alerts.append({
                "priority": "High",
                "icon": "⚠️",
                "message": f"{high_risk_count} high-risk claims pending review",
                "type": "warning"
            })
        else:
            alerts.append({
                "priority": "High",
                "icon": "✅",
                "message": "No high-risk claims - All clear",
                "type": "success"
            })
        
        # Medium Priority Alert: Claims Under Review Status
        pending_claims = sum(1 for c in all_claims if c.status == "Pending")
        
        if pending_claims > 0:
            alerts.append({
                "priority": "Medium",
                "icon": "⏳",
                "message": f"{pending_claims} claims awaiting approval",
                "type": "info"
            })
        else:
            alerts.append({
                "priority": "Medium",
                "icon": "✅",
                "message": "All pending claims processed",
                "type": "success"
            })
        
        # Info Alert: System Health Status
        total_claims = len(all_claims)
        approved_claims = sum(1 for c in all_claims if c.status == "Approved")
        
        if total_claims > 0:
            approval_rate = (approved_claims / total_claims * 100)
            if approval_rate >= 80:
                system_status = "Insurance CRC system operating at peak efficiency"
                status_type = "success"
            elif approval_rate >= 50:
                system_status = "Insurance CRC system operating normally"
                status_type = "success"
            else:
                system_status = "Insurance CRC system requires attention"
                status_type = "info"
        else:
            system_status = "Insurance CRC system ready for operations"
            status_type = "success"
        
        alerts.append({
            "priority": "Info",
            "icon": "ℹ️",
            "message": system_status,
            "type": status_type
        })
        
        return {"alerts": alerts}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching system alerts: {str(e)}",
        )

# ============================================
# RECENT ACTIVITY ENDPOINT
# ============================================
@router.get("/recent-activity", response_model=schemas.RecentActivityResponse)
def get_recent_activity(limit: int = 10, db: Session = Depends(get_db)):
    """Get recent activity logs from database for admin dashboard"""
    try:
        # First, try to fetch from activity_logs table
        try:
            activities = db.query(models.ActivityLog).order_by(
                models.ActivityLog.timestamp.desc()
            ).limit(limit).all()
            
            if activities:
                total_count = db.query(models.ActivityLog).count()
                return {
                    "activities": activities,
                    "total_count": total_count
                }
        except:
            # If ActivityLog table doesn't exist yet, generate from actual data
            pass
        
        # Generate activities from actual claims and users data
        activities = []
        
        # Get recent claims
        recent_claims = db.query(models.Claim).order_by(
            models.Claim.id.desc()
        ).limit(limit).all()
        
        for claim in recent_claims:
            activities.append({
                "id": claim.id,
                "action": f"Claim {claim.status}",
                "description": f"Claim #{claim.claim_id} from {claim.claimant} - ₹{claim.amount}",
                "entity_type": "Claim",
                "entity_id": claim.id,
                "user_id": None,
                "status": "Success",
                "severity": "Info" if claim.status == "Approved" else "Warning",
                "timestamp": None  # Will be replaced with created_at from claim if available
            })
        
        # Get recent users
        recent_users = db.query(models.User).order_by(
            models.User.id.desc()
        ).limit(5).all()
        
        for user in recent_users:
            activities.append({
                "id": 1000 + user.id,  # Offset to avoid ID collision
                "action": "User Registered",
                "description": f"New user {user.name} ({user.email}) registered",
                "entity_type": "User",
                "entity_id": user.id,
                "user_id": None,
                "status": "Success",
                "severity": "Info",
                "timestamp": None
            })
        
        # Sort by ID descending to get most recent first
        activities = sorted(activities, key=lambda x: x["id"], reverse=True)[:limit]
        
        # Convert to proper datetime format for response
        from datetime import datetime
        for activity in activities:
            if activity["timestamp"] is None:
                activity["timestamp"] = datetime.utcnow()
        
        total_count = len(db.query(models.Claim).all()) + len(db.query(models.User).all())
        
        return {
            "activities": activities,
            "total_count": total_count
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching recent activities: {str(e)}",
        )