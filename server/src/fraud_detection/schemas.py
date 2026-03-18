from pydantic import BaseModel


class FraudStatusUpdate(BaseModel):
    status: str