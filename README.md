# JanDrishti Prototype - Phase 1

JanDrishti is an AI-powered civic intelligence platform. This repository contains the Phase 1 implementation which focuses on establishing a secure and clean full-stack foundation.

## Project Structure
- `/frontend` - Vite/React application shell (Frontend development is planned for Phase 2).
- `/backend` - Spring Boot 3.x backend application containing secure APIs for Citizens and Officers.
- `/docs` - Project documentation.
- `/scripts` - Automation scripts.

## Getting Started

### Prerequisites
- JDK 21
- Maven
- Node.js (for frontend)
- MySQL 8+

### Setup MySQL
Create a local MySQL database named `jandrishti`:
```sql
CREATE DATABASE jandrishti;
```

### Backend Setup
1. Navigate to the `backend` directory.
2. Copy `.env.example` to `.env` and fill in your database credentials and JWT secret.
3. Run the application:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```
The application will start on `http://localhost:8080`.

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Run `npm install`
3. Run `npm run dev`

## Documentation
- [Architecture](docs/ARCHITECTURE.md)
- [Security](docs/SECURITY.md)
- [API Reference](docs/API.md)
