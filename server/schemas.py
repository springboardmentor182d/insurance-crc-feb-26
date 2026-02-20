from pydantic import BaseModel

# Signup schema
class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

# Login schema
class LoginRequest(BaseModel):
    email: str
    password: str

# Forgot password schema
class ForgotPasswordRequest(BaseModel):
    email: str
    new_password: str