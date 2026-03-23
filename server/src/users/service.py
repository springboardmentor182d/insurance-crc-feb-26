from sqlalchemy.orm import Session
from src.entities.user import User


def get_user_profile(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_default_preferences():
    return {
        "notifications": {
            "email": {
                "policyUpdates": True,
                "claimStatus": True,
                "paymentReminders": True,
                "recommendations": False,
                "marketing": False,
                "newsletter": True,
            },
            "sms": {
                "claimApproval": True,
                "paymentDue": True,
                "emergencyAlerts": True,
                "policyExpiry": True,
            },
            "push": {
                "enabled": True,
                "claimUpdates": True,
                "messages": True,
                "promotions": False,
            },
        },
        "privacy": {
            "profileVisibility": "private",
            "shareDataWithPartners": False,
            "allowAnalytics": True,
            "showOnlineStatus": False,
        },
        "display": {
            "language": "en",
            "timezone": "Asia/Kolkata",
            "dateFormat": "DD/MM/YYYY",
            "currency": "INR",
            "theme": "light",
        },
        "insurance": {
            "interestedPolicies": ["Health", "Auto"],
            "autoRenewal": True,
            "paperlessBilling": True,
            "preferredPaymentMethod": "upi",

            # ✅ IMPORTANT FIX (NO MORE 500 ERROR)
            "coverageAmount": None,
            "premiumAmount": None,
        },
    }
    
def update_user_profile(db: Session, user_id: int, data):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        return None

    for field, value in data.dict(exclude_unset=True).items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return user


def update_user_preferences(db: Session, user_id: int, preferences: dict):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        return None

    user.preferences = preferences
    db.commit()
    db.refresh(user)
    return user