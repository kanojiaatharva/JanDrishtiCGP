# API Documentation

## Auth Module

The Authentication Module provides identity management for Citizens and Officers.

### Base URL: `/api/v1/auth` (or `/auth` in standard setup)

---

### `POST /auth/citizen/login`
Request OTP for citizen login.
**Body:**
```json
{
  "phone": "+919999999999"
}
```

### `POST /auth/citizen/verify`
Verify OTP and receive tokens.
**Body:**
```json
{
  "phone": "+919999999999",
  "otp": "123456"
}
```
**Response:**
```json
{
  "accessToken": "eyJhbG...",
  "refreshToken": "random_token_string"
}
```

---

### `POST /auth/officer/login`
Login for government officers.
**Body:**
```json
{
  "email": "officer.x@jandrishti.gov.in",
  "password": "password123"
}
```

### `POST /auth/officer/register`
Register a new officer. (Subject to admin approval in production).
**Body:**
```json
{
  "email": "new@gov.in",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "designation": "Clerk"
}
```

---

### `POST /auth/refresh`
Obtain a new access token using a refresh token.
**Body:**
```json
{
  "refreshToken": "random_token_string"
}
```

### `POST /auth/logout`
Revoke the provided refresh token. Requires Authentication.
**Headers:** `Authorization: Bearer <accessToken>`
**Body:**
```json
{
  "refreshToken": "random_token_string"
}
```

### `GET /auth/me`
Fetch the profile of the currently authenticated user. Requires Authentication.
**Headers:** `Authorization: Bearer <accessToken>`
