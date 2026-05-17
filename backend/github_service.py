import requests

def get_github_stats(username: str):
    response = requests.get(f"https://api.github.com/users/{username}/repos")
    if response.status_code != 200:
        error_message = response.json().get("message", "User not found")
        return {"error": error_message}

    repos = response.json()
    total_stars = 0
    languages = {}

    for repo in repos:
        total_stars += repo.get("stargazers_count", 0)
        lang = repo.get("language")
        if lang:
            languages[lang] = languages.get(lang, 0) + 1

    return {
        "username": username,
        "total_repos": len(repos),
        "total_stars": total_stars,
        "languages": languages,
    }
