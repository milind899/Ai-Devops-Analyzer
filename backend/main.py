"""
AI DevOps Risk Analyzer — FastAPI Backend v2
Now with real GitHub API integration.
"""
import re
import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator

from github_service import fetch_github_data
from risk_engine import calculate_risk
from test_engine import generate_recommendations
from decision_engine import make_decision
from prometheus_fastapi_instrumentator import Instrumentator

load_dotenv()

app = FastAPI(
    title="AI DevOps Risk Analyzer",
    description="GitHub-integrated AI-inspired DevOps risk analysis system",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

Instrumentator().instrument(app).expose(app)


class AnalyzeRequest(BaseModel):
    requirement: str
    repo_url: str
    branch: str

    @field_validator("requirement")
    @classmethod
    def validate_requirement(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 10:
            raise ValueError("Requirement must be at least 10 characters")
        if len(v) > 2000:
            raise ValueError("Requirement must not exceed 2000 characters")
        return v

    @field_validator("repo_url")
    @classmethod
    def validate_repo_url(cls, v: str) -> str:
        v = v.strip()
        if not re.match(r"https?://\S+", v):
            raise ValueError("Invalid URL. Must start with http:// or https://")
        return v

    @field_validator("branch")
    @classmethod
    def validate_branch(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Branch name cannot be empty")
        return v


@app.get("/")
async def root():
    return {
        "message": "AI DevOps Risk Analyzer API",
        "version": "2.0.0",
        "github_integrated": True,
        "status": "running",
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.post("/analyze")
async def analyze(data: AnalyzeRequest):
    # ── Step 1: Fetch GitHub data (non-blocking — graceful fallback) ──
    github_data = None
    github_error = None
    try:
        github_data = fetch_github_data(data.repo_url, data.branch)
    except ValueError as e:
        github_error = str(e)
    except Exception as e:
        github_error = f"Unexpected GitHub error: {str(e)}"

    # ── Step 2: Risk Analysis ──
    try:
        risk_data = await calculate_risk(
            data.requirement,
            data.repo_url,
            data.branch,
            github_data=github_data,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Risk analysis failed: {str(e)}")

    # ── Step 3: Generate Test Recommendations ──
    changed_files = github_data.get("changed_files", []) if github_data else []
    recommendations = generate_recommendations(
        risk_data["risk_level"],
        risk_data["risk_score"],
        changed_files,
        risk_data["triggered_keywords"],
    )

    # ── Step 4: Deployment Decision ──
    decision_data = make_decision(risk_data["risk_level"], recommendations)

    # ── Build response ──
    return {
        # Risk
        "risk_score":          risk_data["risk_score"],
        "risk_level":          risk_data["risk_level"],
        "confidence":          risk_data["confidence"],
        "triggered_keywords":  risk_data["triggered_keywords"],
        "risky_files":         risk_data["risky_files"],
        "github_used":         risk_data["github_used"],

        # GitHub info
        "github_connected":    github_data is not None,
        "github_error":        github_error,
        "repo_info":           github_data["repo_info"] if github_data else None,
        "commits_analyzed":    github_data["commits"] if github_data else [],
        "files_analyzed":      changed_files,
        "total_changes":       github_data["total_changes"] if github_data else 0,
        "files_count":         github_data["files_count"] if github_data else 0,

        # Recommendations
        "recommendations":     recommendations,

        # Decision
        "deployment_decision": decision_data["decision"],
        "decision_message":    decision_data["message"],
        "decision_action":     decision_data["action"],
    }
