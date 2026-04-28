"""
GitHub Service
Fetches real data from GitHub API for public repositories.
No auth token required — works with 60 req/hour free limit (enough for demo).
"""
import requests

GITHUB_API = "https://api.github.com"
HEADERS = {
    "Accept": "application/vnd.github.v3+json",
    "User-Agent": "AI-DevOps-Risk-Analyzer/2.0",
}


def parse_github_url(repo_url: str) -> tuple:
    """Extract owner and repo from GitHub URL."""
    url = repo_url.strip().rstrip("/")
    url = url.replace("https://github.com/", "").replace("http://github.com/", "")
    # Remove .git suffix if present
    url = url.replace(".git", "")
    parts = [p for p in url.split("/") if p]
    if len(parts) < 2:
        raise ValueError(f"Cannot parse GitHub URL: '{repo_url}'. Expected format: https://github.com/owner/repo")
    return parts[0], parts[1]


def _get(url: str, params: dict = None) -> dict:
    """Make a GitHub API GET request with error handling."""
    try:
        res = requests.get(url, headers=HEADERS, params=params, timeout=10)
    except requests.exceptions.ConnectionError:
        raise ValueError("Cannot reach GitHub. Check your internet connection.")
    except requests.exceptions.Timeout:
        raise ValueError("GitHub API request timed out. Try again.")

    if res.status_code == 404:
        raise ValueError(f"Not found (404): {url.replace(GITHUB_API, '')}")
    if res.status_code == 403:
        raise ValueError("GitHub API rate limit exceeded (60/hour). Wait and try again.")
    if res.status_code == 409:
        raise ValueError("Repository exists but is empty — no commits yet.")
    if res.status_code != 200:
        raise ValueError(f"GitHub API error {res.status_code}: {res.text[:100]}")

    return res.json()


def fetch_repo_info(owner: str, repo: str) -> dict:
    """Fetch basic repository metadata."""
    data = _get(f"{GITHUB_API}/repos/{owner}/{repo}")
    return {
        "name": data.get("name", repo),
        "full_name": data.get("full_name", f"{owner}/{repo}"),
        "language": data.get("language") or "Unknown",
        "stars": data.get("stargazers_count", 0),
        "open_issues": data.get("open_issues_count", 0),
        "size_kb": data.get("size", 0),
        "default_branch": data.get("default_branch", "main"),
        "description": data.get("description") or "",
    }


def fetch_branch_commits(owner: str, repo: str, branch: str, limit: int = 3) -> list:
    """Fetch recent commits from a specific branch."""
    try:
        data = _get(
            f"{GITHUB_API}/repos/{owner}/{repo}/commits",
            params={"sha": branch, "per_page": limit},
        )
    except ValueError as e:
        if "404" in str(e):
            raise ValueError(f"Branch '{branch}' not found in '{owner}/{repo}'")
        raise

    commits = []
    for c in data:
        commits.append({
            "sha": c["sha"][:7],
            "full_sha": c["sha"],
            "message": c["commit"]["message"].split("\n")[0][:100],
            "author": c["commit"]["author"].get("name", "Unknown"),
            "date": c["commit"]["author"].get("date", "")[:10],
        })
    return commits


def fetch_commit_files(owner: str, repo: str, full_sha: str) -> list:
    """Fetch files changed in a specific commit."""
    try:
        data = _get(f"{GITHUB_API}/repos/{owner}/{repo}/commits/{full_sha}")
    except Exception:
        return []

    files = []
    for f in data.get("files", []):
        files.append({
            "filename": f.get("filename", ""),
            "status": f.get("status", "modified"),   # added | modified | removed | renamed
            "additions": f.get("additions", 0),
            "deletions": f.get("deletions", 0),
            "changes": f.get("changes", 0),
        })
    return files


def fetch_github_data(repo_url: str, branch: str) -> dict:
    """
    Main entry point: fetches all GitHub data needed for risk analysis.
    Raises ValueError with a user-friendly message on failure.
    """
    owner, repo = parse_github_url(repo_url)

    # 1. Repo metadata
    repo_info = fetch_repo_info(owner, repo)

    # 2. Recent commits on branch
    commits = fetch_branch_commits(owner, repo, branch, limit=3)

    # 3. Files changed in the latest commit only (to stay within rate limits)
    changed_files = []
    if commits:
        changed_files = fetch_commit_files(owner, repo, commits[0]["full_sha"])

    return {
        "owner": owner,
        "repo": repo,
        "repo_info": repo_info,
        "commits": commits,
        "changed_files": changed_files,
        "files_count": len(changed_files),
        "total_changes": sum(f["changes"] for f in changed_files),
    }
