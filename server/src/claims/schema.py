from pydantic import BaseModel


class ClaimCreateRequest(BaseModel):
    policy_id: int
    amount: float
    description: str

    date: str | None = None
    time: str | None = None
    location: str | None = None
    report_number: str | None = None
    witnesses: str | None = None
    additional: str | None = None