"""Authentication routes: login and logout."""

from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app import crud
from app.auth import create_access_token, get_current_user
from app.core.config import get_settings
from app.database import get_db
from app.models import User
from app.schemas import Token, UserLogin, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])
settings = get_settings()


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Authenticate with email (username field) and password.

    Returns a JWT access token for subsequent protected requests.
    """
    user = crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return Token(access_token=access_token)


@router.post("/login/json", response_model=Token)
def login_json(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    JSON-based login endpoint for SPA clients.

    Preferred by the React frontend over form-encoded login.
    """
    user = crud.authenticate_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    access_token = create_access_token(data={"sub": str(user.id)})
    return Token(access_token=access_token)


@router.post("/logout")
def logout(_: User = Depends(get_current_user)):
    """
    Logout endpoint for API symmetry.

    JWT tokens are stateless; the client should discard the token locally.
    """
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserResponse)
def auth_me(current_user: User = Depends(get_current_user)):
    """Return the currently authenticated user."""
    return current_user
