from fastapi import APIRouter

from src.todos.models import CreateTodoRequest, TodoItem
from src.todos.service import create_todo, list_todos

router = APIRouter(prefix="/todos", tags=["Todos"])


@router.get("", response_model=list[TodoItem])
def get_todos():
    return list_todos()


@router.post("", response_model=TodoItem)
def add_todo(data: CreateTodoRequest):
    return create_todo(data)