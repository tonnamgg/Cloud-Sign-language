from fastapi import APIRouter, Depends
from app.api.auth import verify_token
from pydantic import BaseModel

router = APIRouter()


class ScoreSubmission(BaseModel):
    score: int


@router.get("/leaderboard")
def leaderboard():
    # Mock data - DB not connected
    return [
        {"rank": 1, "name": "MockUser1", "score": 100},
        {"rank": 2, "name": "MockUser2", "score": 80},
    ]


@router.post("/score")
def save_score(
    score_data: ScoreSubmission,
    token_payload=Depends(verify_token)
):
    # Mock - DB not connected
    username = token_payload.get("cognito:username") or token_payload.get("username") or "unknown"
    return {
        "id": 1,
        "score": score_data.score,
        "user_id": token_payload.get("sub", "mock"),
        "username": username
    }