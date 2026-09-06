# JanDrishti API Reference

Base URL: `http://localhost:8080`

## Authentication

### `POST /api/auth/register`
Register a new Citizen.

**Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "9876543210",
  "password": "securepassword",
  "preferredLanguage": "en"
}
```
**Response**: 200 OK
```text
User registered successfully
```

### `POST /api/auth/login`
Login and receive a JWT.

**Request Body**:
```json
{
  "email": "jane@example.com",
  "password": "securepassword"
}
```
**Response**: 200 OK
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ...",
  "id": 1,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "CITIZEN"
}
```

### `GET /api/auth/me`
Get current user details. Requires Bearer Token.

---

## Health Check

### `GET /api/health`
Check if backend is running.

**Response**: 200 OK
```json
{
  "status": "UP",
  "service": "jandrishti-backend"
}
```

---

## Reports

All report endpoints require `Authorization: Bearer <token>`.

### `POST /api/reports`
Create a new civic complaint.

**Request Body**:
```json
{
  "originalText": "Potholes on main street need urgent repair.",
  "language": "en"
}
```

### `GET /api/reports/my`
Get all reports submitted by the logged-in Citizen.

### `GET /api/reports/{id}`
Get details of a specific report. A Citizen can only view their own reports.
