import os
import sys
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app

client = TestClient(app)

def test_get_practice_questions_beginner():
    resp = client.get("/practice/questions?level=beginner&round=1")
    assert resp.status_code == 200
    data = resp.json()
    assert data["level"] == "beginner"
    assert data["round"] == 1
    assert len(data["questions"]) == 10
    # Check question fields
    q1 = data["questions"][0]
    assert "id" in q1
    assert "question" in q1
    assert "options" in q1
    assert "correct_answer" in q1
    assert "explanation" in q1
    assert "topic_id" in q1

def test_get_practice_questions_all_levels():
    for level in ["beginner", "intermediate", "advanced"]:
        for r in [1, 2, 3]:
            resp = client.get(f"/practice/questions?level={level}&round={r}")
            assert resp.status_code == 200
            data = resp.json()
            assert len(data["questions"]) == 10

def test_submit_practice_round_pass():
    # Submit 10 answers with 8 correct (80% >= 70% threshold)
    answers = []
    for i in range(1, 11):
        answers.append({
            "question_id": i,
            "selected_option": 1 if i <= 8 else 0,
            "is_correct": True if i <= 8 else False,
            "topic_id": "qubit" if i <= 5 else "superposition"
        })
    payload = {
        "user_id": "test-user-pass",
        "level": "beginner",
        "round": 1,
        "answers": answers
    }
    resp = client.post("/practice/submit", json=payload)
    assert resp.status_code == 200
    result = resp.json()
    assert result["passed"] is True
    assert result["score"] == 8
    assert result["total"] == 10
    assert result["percentage"] == 80
    assert result["new_round_unlocked"] == 2

def test_submit_practice_round_fail():
    # Submit 10 answers with 4 correct (40% < 70% threshold)
    answers = []
    for i in range(1, 11):
        answers.append({
            "question_id": i,
            "selected_option": 0,
            "is_correct": True if i <= 4 else False,
            "topic_id": "qubit"
        })
    payload = {
        "user_id": "test-user-fail",
        "level": "beginner",
        "round": 1,
        "answers": answers
    }
    resp = client.post("/practice/submit", json=payload)
    assert resp.status_code == 200
    result = resp.json()
    assert result["passed"] is False
    assert result["score"] == 4
    assert result["total"] == 10
    assert result["new_round_unlocked"] is None

def test_user_practice_progress():
    resp = client.get("/practice/progress/test-user-pass")
    assert resp.status_code == 200
    prog = resp.json()
    assert prog["user_id"] == "test-user-pass"
    assert "unlocked_levels" in prog
    assert "round_scores" in prog
