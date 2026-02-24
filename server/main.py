from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# HOME API
@app.get("/")
def home():
    return {"message": "Backend running"}

# TEST API
@app.get("/test")
def test():
    return {"status": "connected"}

# LOGIN API
@app.post("/login")
def login(data: dict):
    email = data["email"]

    if "admin" in email:
        return {"role": "admin"}
    else:
        return {"role": "user"}