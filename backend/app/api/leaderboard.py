from fastapi import APIRouter, Depends
from app.api.auth import get_current_user

router = APIRouter()

# In-memory mock data
mock_scores: list[dict] = [
    {"name": "Alice", "score": 120},
    {"name": "Bob", "score": 95},
    {"name": "Charlie", "score": 80},
]


@router.post("/score")
def save_score(score: int, current=Depends(get_current_user)):
    username = current["username"]
    existing = next((s for s in mock_scores if s["name"] == username), None)
    if existing:
        existing["score"] = max(existing["score"], score)
    else:
        mock_scores.append({"name": username, "score": score})
    return {"message": "Score saved"}


@router.get("/leaderboard")
def leaderboard():
    sorted_scores = sorted(mock_scores, key=lambda s: s["score"], reverse=True)[:10]
    return [
        {"rank": i + 1, "name": s["name"], "score": s["score"]}
        for i, s in enumerate(sorted_scores)
    ]