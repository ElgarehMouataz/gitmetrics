import responses  
from github_service import get_github_stats

@responses.activate
def test_get_github_stats_success():
    username="testuser"
    url = f"https://api.github.com/users/{username}/repos"
    responses.add(
        responses.GET,
        url,
        json=[
            {
                "stargazers_count": 10,
                "language": "Python",
            },
            {
                "stargazers_count": 5,
                "language": "JavaScript",
            },
            {
                "stargazers_count": 3,
                "language": "Python",
            },
        ],
        status=200
    )

    stats = get_github_stats(username)

    assert stats["total_stars"] == 18
    assert stats["total_repos"] == 3
    assert stats["languages"] == {
        "Python": 2,
        "JavaScript": 1,
    }


@responses.activate
def test_get_github_stats_not_found():
    username = "missinguser"
    url = f"https://api.github.com/users/{username}/repos"
    responses.add(
        responses.GET,
        url,
        json={"message": "Not Found"},
        status=404,
    )

    stats = get_github_stats(username)

    assert stats["error"] == "Not Found"
