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
                "name": "repo1",
                "stargazers_count": 10,
                "forks_count": 2,
                "watchers_count": 5,
                "language": "Python",
                "html_url": "https://github.com/testuser/repo1"
            },
            {
                "name": "repo2",
                "stargazers_count": 5,
                "forks_count": 1,
                "watchers_count": 3,
                "language": "JavaScript",
                "html_url": "https://github.com/testuser/repo2"
            },
            {
                "name": "repo3",
                "stargazers_count": 3,
                "forks_count": 0,
                "watchers_count": 1,
                "language": "Python",
                "html_url": "https://github.com/testuser/repo3"
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
    assert len(stats["repos"]) == 3
    assert stats["repos"][0]["name"] == "repo1"
    assert stats["repos"][0]["forks"] == 2
    assert stats["repos"][0]["watchers"] == 5


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
