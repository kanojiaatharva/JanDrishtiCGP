# JanDrishti Security Guidelines

Security is a first-class requirement for the JanDrishti platform. 

## Authentication & Authorization
- **JWT (JSON Web Tokens)**: Authentication is completely stateless. A short-lived JWT is issued upon successful login.
- **Passwords**: Stored using `BCryptPasswordEncoder`. Plaintext passwords are NEVER stored or logged.
- **Role-Based Access Control**: Implemented across all layers. `CITIZEN` and `OFFICER` have distinct roles. Backend endpoints enforce these roles rigorously (e.g., a CITIZEN can only view their own reports).

## Input Validation & Error Handling
- **Jakarta Bean Validation**: All incoming requests are validated for length, format, and correctness.
- **Global Exception Handling**: Centralized using `@RestControllerAdvice`. Internal errors or stack traces are never leaked to the client.

## Data Security
- **SQL Injection**: Prevented by using Spring Data JPA. No string concatenation is used for building queries.
- **Secrets Management**: Credentials, API Keys (like Gemini AI keys), and JWT secrets are stored in `.env` files and never committed to the repository.

## Networking
- **CORS**: Configured strictly to allow only the development frontend (`http://localhost:5173`) using specific HTTP methods. No `*` origins.
- **CSRF**: Disabled as the APIs are stateless and rely exclusively on the `Authorization: Bearer <token>` header, making them immune to standard browser CSRF if cookies are not used for auth.
