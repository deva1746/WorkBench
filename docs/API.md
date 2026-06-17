# Productivity OS — API Documentation

Base URL: `http://localhost:8000/api`

All protected endpoints require an `Authorization: Bearer <token>` header.

Interactive docs: http://localhost:8000/api/docs

---

## Health Check

### `GET /api/health`

**Response `200 OK`:**

```json
{
  "status": "healthy",
  "service": "Productivity OS API"
}
```

---

## Authentication

### `POST /api/auth/login/json`

JSON login for SPA clients.

**Request:**

```json
{
  "email": "jane@example.com",
  "password": "securepass123"
}
```

**Response `200 OK`:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Response `401 Unauthorized`:**

```json
{
  "detail": "Incorrect email or password"
}
```

---

### `POST /api/auth/login`

OAuth2 form login (for Swagger UI).

**Request:** `application/x-www-form-urlencoded`

| Field      | Value              |
| ---------- | ------------------ |
| username   | jane@example.com   |
| password   | securepass123      |

**Response:** Same as `/login/json`

---

### `POST /api/auth/logout`

Requires authentication.

**Response `200 OK`:**

```json
{
  "message": "Successfully logged out"
}
```

---

### `GET /api/auth/me`

Returns the authenticated user profile.

**Response `200 OK`:**

```json
{
  "id": 1,
  "email": "jane@example.com",
  "full_name": "Jane Doe",
  "is_active": true,
  "created_at": "2026-06-17T10:00:00Z"
}
```

---

## Users

### `POST /api/users/register`

Create a new user account.

**Request:**

```json
{
  "email": "jane@example.com",
  "full_name": "Jane Doe",
  "password": "securepass123"
}
```

**Response `201 Created`:**

```json
{
  "id": 1,
  "email": "jane@example.com",
  "full_name": "Jane Doe",
  "is_active": true,
  "created_at": "2026-06-17T10:00:00Z"
}
```

**Response `400 Bad Request`:**

```json
{
  "detail": "Email already registered"
}
```

---

### `GET /api/users/me`

Same as `GET /api/auth/me`.

---

## Tasks

All task endpoints require authentication.

### `GET /api/tasks`

List all tasks for the authenticated user.

**Response `200 OK`:**

```json
[
  {
    "id": 1,
    "title": "Complete project proposal",
    "description": "Draft and review the Q3 proposal",
    "is_completed": false,
    "priority": "high",
    "due_date": "2026-06-20T17:00:00Z",
    "user_id": 1,
    "created_at": "2026-06-17T10:00:00Z",
    "updated_at": "2026-06-17T10:00:00Z"
  }
]
```

---

### `POST /api/tasks`

Create a new task.

**Request:**

```json
{
  "title": "Complete project proposal",
  "description": "Draft and review the Q3 proposal",
  "priority": "high",
  "due_date": "2026-06-20T17:00:00Z"
}
```

| Field         | Type     | Required | Values                    |
| ------------- | -------- | -------- | ------------------------- |
| title         | string   | Yes      | 1–255 chars               |
| description   | string   | No       | —                         |
| priority      | enum     | No       | `low`, `medium`, `high`   |
| due_date      | datetime | No       | ISO 8601                  |

**Response `201 Created`:**

```json
{
  "id": 1,
  "title": "Complete project proposal",
  "description": "Draft and review the Q3 proposal",
  "is_completed": false,
  "priority": "high",
  "due_date": "2026-06-20T17:00:00Z",
  "user_id": 1,
  "created_at": "2026-06-17T10:00:00Z",
  "updated_at": "2026-06-17T10:00:00Z"
}
```

---

### `GET /api/tasks/{task_id}`

Get a single task by ID.

**Response `200 OK`:** Single task object (same shape as above)

**Response `404 Not Found`:**

```json
{
  "detail": "Task not found"
}
```

---

### `PUT /api/tasks/{task_id}`

Update a task (partial updates supported).

**Request:**

```json
{
  "title": "Updated title",
  "priority": "medium",
  "is_completed": true
}
```

**Response `200 OK`:** Updated task object

---

### `PATCH /api/tasks/{task_id}/complete`

Toggle task completion status.

**Response `200 OK`:** Updated task object with toggled `is_completed`

---

### `DELETE /api/tasks/{task_id}`

Delete a task permanently.

**Response `204 No Content`**

---

## Dashboard

### `GET /api/tasks/dashboard/stats`

Aggregated statistics for the authenticated user.

**Response `200 OK`:**

```json
{
  "total_tasks": 12,
  "completed_tasks": 7,
  "pending_tasks": 5,
  "overdue_tasks": 2,
  "completion_percentage": 58.3
}
```

| Field                  | Description                                      |
| ---------------------- | ------------------------------------------------ |
| total_tasks            | All tasks owned by the user                      |
| completed_tasks        | Tasks marked as complete                         |
| pending_tasks          | Tasks not yet completed                          |
| overdue_tasks          | Pending tasks with due_date in the past          |
| completion_percentage  | (completed / total) × 100, rounded to 1 decimal |

---

## Error Responses

| Status | Meaning              |
| ------ | -------------------- |
| 400    | Bad request / validation error |
| 401    | Missing or invalid JWT token     |
| 404    | Resource not found               |
| 422    | Pydantic validation failure      |

**Validation error example (`422`):**

```json
{
  "detail": [
    {
      "loc": ["body", "password"],
      "msg": "String should have at least 8 characters",
      "type": "string_too_short"
    }
  ]
}
```

---

## Quick Test with cURL

```bash
# Register
curl -X POST http://localhost:8000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","full_name":"Test User","password":"password123"}'

# Login
curl -X POST http://localhost:8000/api/auth/login/json \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Create task (replace TOKEN)
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My first task","priority":"high"}'

# Dashboard stats
curl http://localhost:8000/api/tasks/dashboard/stats \
  -H "Authorization: Bearer TOKEN"
```
