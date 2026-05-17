from fastapi.testclient import TestClient
from unittest.mock import patch
from main import app

client = TestClient(app)

@patch("main.get_github_stats")
def test_analyze_user_endpoint_success(mock_get_github_stats):
    mock_get_github_stats.return_value = {
        "username": "testuser",
        "total_repos": 3,
        "total_stars": 18,
        "languages": {"Python": 2, "JavaScript": 1},
    }

    response = client.get("/api/analyze/testuser")

    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert data["total_repos"] == 3
    assert data["total_stars"] == 18
    assert data["languages"] == {"Python": 2, "JavaScript": 1}


@patch("main.get_github_stats")
def test_analyze_user_endpoint_404(mock_get_github_stats):
    mock_get_github_stats.return_value = {"error": "User not found"}

    response = client.get("/api/analyze/invaliduser")

    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"