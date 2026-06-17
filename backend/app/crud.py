"""Database CRUD operations for users and tasks."""

from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.auth import get_password_hash, verify_password
from app.models import Task, TaskPriority, User
from app.schemas import DashboardStats, TaskCreate, TaskUpdate, UserCreate


# ---------------------------------------------------------------------------
# User CRUD
# ---------------------------------------------------------------------------


def get_user_by_email(db: Session, email: str) -> User | None:
    """Fetch a user by email address."""
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user_in: UserCreate) -> User:
    """Create a new user with a hashed password."""
    db_user = User(
        email=user_in.email.lower(),
        full_name=user_in.full_name.strip(),
        hashed_password=get_password_hash(user_in.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    """Validate credentials and return the user if valid."""
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


# ---------------------------------------------------------------------------
# Task CRUD
# ---------------------------------------------------------------------------


def get_tasks_for_user(db: Session, user_id: int) -> list[Task]:
    """Return all tasks belonging to a user, newest first."""
    return (
        db.query(Task)
        .filter(Task.user_id == user_id)
        .order_by(Task.created_at.desc())
        .all()
    )


def get_task_for_user(db: Session, task_id: int, user_id: int) -> Task | None:
    """Fetch a single task scoped to the owning user."""
    return db.query(Task).filter(Task.id == task_id, Task.user_id == user_id).first()


def create_task(db: Session, task_in: TaskCreate, user_id: int) -> Task:
    """Persist a new task for the given user."""
    db_task = Task(
        title=task_in.title.strip(),
        description=task_in.description,
        priority=task_in.priority,
        due_date=task_in.due_date,
        user_id=user_id,
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def update_task(db: Session, task: Task, task_in: TaskUpdate) -> Task:
    """Apply partial updates to an existing task."""
    update_data = task_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task: Task) -> None:
    """Remove a task from the database."""
    db.delete(task)
    db.commit()


def get_dashboard_stats(db: Session, user_id: int) -> DashboardStats:
    """
    Compute dashboard metrics for the authenticated user.

    Overdue tasks are pending tasks with a due date in the past.
    """
    tasks = db.query(Task).filter(Task.user_id == user_id).all()
    now = datetime.now(timezone.utc)

    total = len(tasks)
    completed = sum(1 for task in tasks if task.is_completed)
    pending = total - completed
    overdue = sum(
        1
        for task in tasks
        if not task.is_completed
        and task.due_date is not None
        and task.due_date.replace(tzinfo=timezone.utc) < now
    )
    completion_percentage = round((completed / total) * 100, 1) if total else 0.0

    return DashboardStats(
        total_tasks=total,
        completed_tasks=completed,
        pending_tasks=pending,
        overdue_tasks=overdue,
        completion_percentage=completion_percentage,
    )
