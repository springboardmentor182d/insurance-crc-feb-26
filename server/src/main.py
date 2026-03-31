from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.core import engine, Base

# Register ALL models before create_all
from entities.user        import User        # noqa
from entities.todo        import Todo        # noqa
from entities.profile     import UserProfile     # noqa
from entities.preferences import UserPreferences # noqa

# Create all DB tables
Base.metadata.create_all(bind=engine)

# Import all routers
from auth.controller        import router as auth_router
from users.controller       import router as users_router
from todos.controller       import router as todos_router
from profile.controller     import router as profile_router
from preferences.controller import router as preferences_router

app = FastAPI(title="InsureAI API", version="1.0.0")

# Allow React frontend on port 3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(auth_router,         prefix="/api/v1")
app.include_router(users_router,        prefix="/api/v1")
app.include_router(todos_router,        prefix="/api/v1")
app.include_router(profile_router,      prefix="/api/v1")
app.include_router(preferences_router,  prefix="/api/v1")


@app.get("/")
def root():
    return {"message": "InsureAI API is running ✓"}