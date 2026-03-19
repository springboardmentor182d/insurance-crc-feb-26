from src.entities.user import User

def create_user(db, name, email, password):
    
    role = "admin" if email == "admin@gmail.com" else "user"

    user = User(
        name=name,
        email=email,
        password=password,
        role=role
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def login_user(db, email, password):

    user = db.query(User).filter(User.email == email).first()

    if not user:
        return None

    if user.password != password:
        return None

    return user