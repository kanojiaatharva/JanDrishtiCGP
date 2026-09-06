# JanDrishti Architecture

## Overview
JanDrishti employs a layered monolithic architecture built with Spring Boot 3.x and Java 21, designed to handle civic complaints securely and structure data for future AI integration.

## Layers
1. **Controllers**: REST controllers that handle incoming HTTP requests, perform initial DTO validation (via Jakarta Bean Validation), and delegate business logic to Services. Controllers never expose Entity models.
2. **Services**: Contains the core business logic. Enforces authorization rules alongside Spring Security.
3. **Repositories**: Interfaces extending `JpaRepository` for data access. 
4. **Entities**: Hibernate managed models mapped to MySQL tables.

## Tech Stack
- **Framework**: Spring Boot 3.2
- **Language**: Java 21
- **Security**: Spring Security + JWT (Stateless)
- **Database**: MySQL 8+ via Spring Data JPA / Hibernate
- **Build Tool**: Maven

## Future Phases
- **Phase 2**: Integration with Google Gemini for AI analysis of reports (Extraction of entities, intent, translation).
- **Phase 3**: Analytics Dashboards and Advanced Clustering.
