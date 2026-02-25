from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# CORS (frontend connect ஆகணும்)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- API ROUTES ----------------

@app.get("/recommendations")
def get_recommendations():
    return [
        {
            "title": "Consider Disability Insurance",
            "description": "Protect your income in case of disability."
        },
        {
            "title": "Increase Life Insurance Coverage",
            "description": "Ensure your family is financially secure."
        }
    ]

# ---------------- REACT BUILD SERVE ----------------

app.mount("/", StaticFiles(directory="build", html=True), name="static")