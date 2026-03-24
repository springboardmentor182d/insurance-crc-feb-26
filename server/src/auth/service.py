
def login_service(email):

    if email == "admin@gmail.com":
        return {
            "role": "admin",
            "redirect": "/admin-dashboard"
        }

    elif email == "user@gmail.com":
        return {
            "role": "user",
            "redirect": "/user-dashboard"
        }

    return {"role": "invalid","ridirect":"/invalid"}
# update 
