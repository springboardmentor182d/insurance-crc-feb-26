from src.todos.models import CreateTodoRequest, TodoItem

_todos: list[TodoItem] = []
_next_id = 1


def list_todos() -> list[TodoItem]:
    return _todos


def create_todo(data: CreateTodoRequest) -> TodoItem:
    global _next_id
    todo = TodoItem(id=_next_id, title=data.title, completed=False)
    _todos.append(todo)
    _next_id += 1
    return todo
