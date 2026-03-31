from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List

from entities.todo import Todo
from entities.user import User
from todos.models import TodoCreate, TodoUpdate, TodoResponse


def get_todos(user: User, db: Session) -> List[TodoResponse]:
    todos = db.query(Todo).filter(Todo.user_id == user.id).all()
    return [TodoResponse.model_validate(t) for t in todos]


def create_todo(payload: TodoCreate, user: User, db: Session) -> TodoResponse:
    todo = Todo(title=payload.title, user_id=user.id)
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return TodoResponse.model_validate(todo)


def update_todo(todo_id: int, payload: TodoUpdate, user: User, db: Session) -> TodoResponse:
    todo = db.query(Todo).filter(Todo.id == todo_id, Todo.user_id == user.id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(todo, field, value)
    db.commit()
    db.refresh(todo)
    return TodoResponse.model_validate(todo)


def delete_todo(todo_id: int, user: User, db: Session):
    todo = db.query(Todo).filter(Todo.id == todo_id, Todo.user_id == user.id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    db.delete(todo)
    db.commit()
    return {"message": "Deleted successfully"}