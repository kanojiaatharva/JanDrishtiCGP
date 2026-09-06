# Security Architecture

## Authentication

### Citizen Flow
Citizens authenticate via a phone-based OTP system.
- In **development**, the OTP is mocked and prints to the console (`123456`).
- In **production**, this will integrate with an SMS gateway or WhatsApp API.

### Officer Flow
Officers authenticate via Email and Password.
- Passwords are **never** stored in plain text.
- Passwords are hashed using **Argon2** (`argon2id`) directly in the NestJS service.

### Token Strategy
- **Access Tokens**: Short-lived (15m) JWTs containing the user's `sub` (ID) and `role`.
- **Refresh Tokens**: Long-lived (7d) tokens used to get new Access Tokens.
- Refresh Tokens are securely stored in the database as **SHA256 hashes**. This prevents attackers from using stolen database dumps to hijack active sessions.
- **Token Rotation**: Using a refresh token invalidates it and issues a new one.

## Authorization (RBAC)

Authorization is strictly enforced server-side. **Client-provided roles are ignored.**
The JWT payload determines the role, which is validated against the `RolesGuard` in NestJS.

- `@UseGuards(JwtAuthGuard)`: Requires a valid access token.
- `@Roles('SUPER_ADMIN', 'DISTRICT_ADMIN')`: Restricts endpoints to specific roles.

## Best Practices
- Never commit `.env` or service accounts.
- Do not expose internal stack traces.
- Use explicit validation schemas for all inputs (Zod/Class-Validator).
