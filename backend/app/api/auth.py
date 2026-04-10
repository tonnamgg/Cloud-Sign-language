from fastapi import Header


def get_current_user(x_user_id: str | None = Header(default=None)):
    # Dev fallback for local API testing without Cognito/JWT setup.
    if x_user_id:
        return {"cognito_id": x_user_id, "username": x_user_id}

    return {"cognito_id": "dev-user", "username": "dev-user"}
