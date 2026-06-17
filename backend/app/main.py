"""
Productivity OS — FastAPI application entry point.

Run with:
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.database import Base, engine
from app.routes import auth, tasks, users

settings = get_settings()

# Create database tables on startup (use Alembic migrations in production).
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Productivity OS API",
    description="Production-ready task management API with JWT authentication.",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# Enable CORS for the React frontend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount route modules under /api prefix.
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(tasks.router, prefix="/api")


@app.get("/api/health")
def health_check():
    """Simple health check endpoint for load balancers and Docker."""
    return {"status": "healthy", "service": "Productivity OS API"}
