from fastapi import FastAPI, HTTPException  
from fastapi.middleware.cors import CORSMiddleware  
from github_service import get_github_stats

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"], allow_methods=["*"], allow_headers=["*"],allow_credentials=True)
@app.get("/api/analyze/{username}")
async def analyse_github(username: str):
    result = get_github_stats(username)

    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result
