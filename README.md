# WorkBench

A production-ready full-stack task management application with JWT authentication, real-time dashboard analytics, and a modern glassmorphism UI.

- https://3hnfx6mc-5174.inc1.devtunnels.ms/

## Tech Stack

| Layer    | Technologies                                              |
| -------- | --------------------------------------------------------- |
| Frontend | React 18, Vite, React Router, Axios, Framer Motion, Chart.js, React Hot Toast |
| Backend  | FastAPI, SQLAlchemy, Pydantic, JWT (python-jose), Passlib |
| Database | PostgreSQL 16                                             |

## Project Structure

```
productivity-os/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   └── config.py          # Environment settings
│   │   ├── routes/
│   │   │   ├── auth.py            # Login / logout
│   │   │   ├── tasks.py           # Task CRUD + dashboard stats
│   │   │   └── users.py           # Registration + profile
│   │   ├── auth.py                # JWT utilities
│   │   ├── crud.py                # Database operations
│   │   ├── database.py            # SQLAlchemy engine & session
│   │   ├── main.py                # FastAPI app entry point
│   │   ├── models.py              # ORM models
│   │   └── schemas.py             # Pydantic schemas
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/         # StatisticsCards, ProgressChart
│   │   │   ├── layout/            # Navbar, Sidebar, Layout
│   │   │   └── tasks/             # TaskForm, TaskList
│   │   ├── context/               # Auth & Theme providers
│   │   ├── pages/                 # Login, Register, Dashboard
│   │   └── services/              # Axios API client
│   ├── package.json
│   └── vite.config.js
├── database/
│   └── schema.sql                 # PostgreSQL DDL


## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+
- **Docker** (recommended for PostgreSQL) or a local PostgreSQL 16 install

## Setup Guide

### 1. Clone / navigate to the project

```bash
cd C:\Users\javva\Projects\productivity-os
```

### 2. Start PostgreSQL

- open pgadmin in local


### 3. Backend setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file and edit if needed
copy .env

# Start the API server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API:** http://localhost:8000/api
- **Swagger Docs:** http://localhost:8000/api/docs
- **ReDoc:** http://localhost:8000/api/redoc

### 4. Frontend setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
copy .env

# Start dev server
npm run dev
```

The app will be available at **http://localhost:5173**

### 5. First use

1. Open http://localhost:5173/register
2. Create an account
3. You'll be redirected to the dashboard
4. Create tasks, set priorities and due dates, and track your progress

## Environment Variables

### Backend (`backend/.env`)

| Variable                    | Default                                              | Description              |
| --------------------------- | ---------------------------------------------------- | ------------------------ |
| `DATABASE_URL`              | `postgresql://postgres:postgres@localhost:5432/productivity_os` | PostgreSQL connection |
| `SECRET_KEY`                | (change in production)                               | JWT signing key          |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440`                                           | Token lifetime (24h)     |
| `CORS_ORIGINS`              | `http://localhost:5173`                              | Allowed frontend origins |

### Frontend (`frontend/.env`)

| Variable       | Default                        | Description |
| -------------- | ------------------------------ | ----------- |
| `VITE_API_URL` | `http://localhost:8000/api`    | Backend API |

## Features

- **Authentication** — Register, login, logout with JWT tokens
- **Task Management** — Create, edit, delete, complete tasks with priority and due dates
- **Dashboard** — Total, completed, pending, and overdue task counts with completion percentage
- **Charts** — Doughnut charts for completion progress and priority breakdown
- **UI** — Glassmorphism design, dark/light theme toggle, responsive mobile layout
- **Animations** — Smooth transitions powered by Framer Motion

## Production Notes

- Change `SECRET_KEY` to a cryptographically secure random string
- Use Alembic for database migrations instead of `create_all`
- Deploy behind HTTPS with proper CORS configuration
- Set `ACCESS_TOKEN_EXPIRE_MINUTES` appropriately for your security policy

## Test my application here
- python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
- npm run dev -- --host 0.0.0.0 --port 5174
