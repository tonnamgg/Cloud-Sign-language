from fastapi import APIRouter, Depends
from app.api.auth import get_current_user

router = APIRouter()

# In-memory mock users
mock_users: list[dict] = []


@router.post("/me")
def create_or_get_user(current=Depends(get_current_user)):
    existing = next((u for u in mock_users if u["cognito_id"] == current["cognito_id"]), None)
    if not existing:
        existing = {
            "id": len(mock_users) + 1,
            "cognito_id": current["cognito_id"],
            "username": current["username"],
        }
        mock_users.append(existing)
    return existing