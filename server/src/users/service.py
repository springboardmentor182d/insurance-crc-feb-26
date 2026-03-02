from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.entities.user import User, UserPreferences
from src.users.models import ProfileBase, PreferencesBase

from src.auth.models import LoginRequest, RegisterRequest, TokenResponse



class UserService:
    @staticmethod
    async def get_user_profile(
        db: AsyncSession,
        user_id: int
    ) -> Optional[User]:
        result = await db.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def update_user_profile(
        db: AsyncSession,
        user_id: int,
        profile_data: ProfileBase
    ) -> User:
        result = await db.execute(
            select(User).where(User.id == user_id)
        )
        user = result.scalar_one_or_none()

        if not user:
            raise ValueError("User not found")

        update_data = profile_data.dict(exclude_unset=True)

        for field, value in update_data.items():
            setattr(user, field, value)

        await db.commit()
        await db.refresh(user)
        return user

    @staticmethod
    async def get_user_preferences(
        db: AsyncSession,
        user_id: int
    ) -> UserPreferences:
        result = await db.execute(
            select(UserPreferences).where(UserPreferences.user_id == user_id)
        )
        preferences = result.scalar_one_or_none()

        if not preferences:
            preferences = UserPreferences(user_id=user_id)
            db.add(preferences)
            await db.commit()
            await db.refresh(preferences)

        return preferences

    @staticmethod
    async def update_user_preferences(
        db: AsyncSession,
        user_id: int,
        preferences_data: PreferencesBase
    ) -> UserPreferences:
        result = await db.execute(
            select(UserPreferences).where(UserPreferences.user_id == user_id)
        )
        preferences = result.scalar_one_or_none()

        if not preferences:
            preferences = UserPreferences(user_id=user_id)
            db.add(preferences)

        update_data = preferences_data.dict(exclude_unset=True)

        for field, value in update_data.items():
            setattr(preferences, field, value)

        await db.commit()
        await db.refresh(preferences)
        return preferences

class AuthService:
    @staticmethod
    async def login(db: AsyncSession, data: LoginRequest) -> TokenResponse | None:
        # TODO: check user in DB, verify password, generate JWT
        # Return None if invalid credentials
        return TokenResponse(access_token="dummy-token")

    @staticmethod
    async def register(db: AsyncSession, data: RegisterRequest) -> TokenResponse:
        # TODO: create user in DB, hash password, generate JWT
        return TokenResponse(access_token="dummy-token")
