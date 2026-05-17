# GitMetrics

GitMetrics is a full-stack web application designed to analyze GitHub developer profiles, aggregate repository statistics, and visualize programming language usage.

---

## Existing Project Structure & Files

This documentation covers the files currently implemented in the repository.

```text
gitmetrics/
├── backend/
│   ├── main.py                  # FastAPI application entry point defining API routes and CORS middleware
│   ├── github_service.py        # Service module handling external HTTP requests to the GitHub REST API
│   ├── requirements.txt         # Python package dependencies (fastapi, uvicorn, requests, etc.)
│   ├── test_main.py             # Unit tests for FastAPI endpoints using TestClient
│   └── test_github_service.py   # Unit tests for GitHub API fetching and data aggregation logic
│
├── frontend/
│   ├── package.json             # React + Vite project configuration and dependencies (axios, recharts)
│   ├── vite.config.js           # Vite bundler and Vitest test runner configuration
│   └── src/
│       ├── App.jsx              # Main React application component
│       ├── main.jsx             # React DOM rendering entry point
│       ├── index.css            # Global CSS styles and color palette variables
│       └── App.css              # Component-specific styling
│
├── gitmetrics_implementation_plan.md # Comprehensive roadmap and phase-by-phase implementation guide
└── .gitignore                   # Git untrack configuration for virtual environments, node_modules, and caches
```

### Backend File Details
- **`backend/main.py`**: Initializes the FastAPI server, configures CORS to permit requests from the local React frontend (`http://localhost:5173`), and defines the primary `/api/analyze/{username}` endpoint.
- **`backend/github_service.py`**: Implements `get_github_stats(username)`, which makes requests to GitHub's public API, calculates total repository count and star count, and aggregates language usage statistics.
- **`backend/requirements.txt`**: Lists required Python libraries for running the backend and executing test suites.
- **`backend/test_*.py`**: Automated test suites verifying backend route handling, error propagation, and data parsing logic.

### Frontend File Details
- **`frontend/src/App.jsx`**: The root React component serving as the interface for the GitMetrics development environment.
- **`frontend/src/main.jsx`**: Bootstraps the React application and mounts it to the DOM.
- **`frontend/src/index.css` & `App.css`**: Contain the base styles and layout definitions for the application.

---

## API Endpoints

The backend exposes a REST API powered by FastAPI.

### `GET /api/analyze/{username}`

Analyzes a specified GitHub user's public repositories and returns aggregated metrics.

#### Parameters
- `username` *(string, required)*: The GitHub username to analyze (passed as a path parameter).

#### Success Response (200 OK)
```json
{
  "username": "octocat",
  "total_repos": 5,
  "total_stars": 142,
  "languages": {
    "Python": 3,
    "JavaScript": 2
  }
}
```

#### Error Response (404 Not Found)
Returned when the specified GitHub username does not exist or cannot be fetched.
```json
{
  "detail": "User not found"
}
```

---

## Commands to Start the Backend (Server)

To start the FastAPI backend server locally on Windows, open your terminal and execute the following commands from the root directory:

```powershell
# 1. Navigate to the backend directory
cd backend

# 2. Activate the Python virtual environment
venv\Scripts\activate

# 3. Start the FastAPI server using Uvicorn with live reload enabled
uvicorn main:app --reload
```

Once running, the backend API will be accessible at:
- **API Base URL**: `http://localhost:8000`
- **Interactive API Documentation (Swagger UI)**: `http://localhost:8000/docs`

---

### Starting the Frontend (Optional Context)
If you also wish to run the React frontend development server alongside the backend:
```powershell
# Open a new terminal window/tab from the root directory
cd frontend
npm run dev
```
The frontend will be accessible at `http://localhost:5173`.
