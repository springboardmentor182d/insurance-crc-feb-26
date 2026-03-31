from pydantic import BaseModel


class TodoItem(BaseModel):
    id: int
    title: str
    completed: bool = False


class CreateTodoRequest(BaseModel):
    title: str
    