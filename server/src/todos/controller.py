from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from database.core import get_db
from auth.service import get_current_user
from entities.user import User
from todos.models import TodoCreate, TodoUpdate, TodoResponse
import todos.service as service

router = APIRouter(prefix="/todos", tags=["Todos"])


@router.get("/", response_model=List[TodoResponse])
def get_todos(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return service.get_todos(current_user, db)


@router.post("/", response_model=TodoResponse)
def create_todo(
    payload: TodoCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return service.create_todo(payload, current_user, db)


@router.put("/{todo_id}", response_model=TodoResponse)
def update_todo(
    todo_id: int,
    payload: TodoUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return service.update_todo(todo_id, payload, current_user, db)


@router.delete("/{todo_id}")
def delete_todo(
    todo_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return service.delete_todo(todo_id, current_user, db)