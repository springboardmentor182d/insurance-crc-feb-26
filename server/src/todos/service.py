from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from src.users.models import UserUpdate


class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_profile(self, user_id: int) -> dict:
        result = await self.db.execute(
            text("SELECT id, name, email, role, dob, risk_profile, created_at FROM users WHERE id = :id"),
            {"id": user_id}
        )
        user = result.fetchone()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return dict(user._mapping)

    async def update_profile(self, user_id: int, data: UserUpdate) -> dict:
        updates = {k: v for k, v in data.model_dump().items() if v is not None}
        if not updates:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")
        set_clause    = ", ".join(f"{k} = :{k}" for k in updates)
        updates["id"] = user_id
        await self.db.execute(text(f"UPDATE users SET {set_clause} WHERE id = :id"), updates)
        await self.db.commit()
        return await self.get_profile(user_id)