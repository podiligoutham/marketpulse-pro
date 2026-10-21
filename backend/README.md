# MarketPulse Pro — Spring Boot backend

Java 21 + Spring Boot 3.5.7 + WebFlux + R2DBC + PostgreSQL + Flyway.

## Prerequisites
- JDK 21
- Maven 3.9+ (the Maven wrapper is **not** bundled; see note below)
- Optional: Docker Desktop for PostgreSQL

## 1. Start without a database (Milestone 16.1)
From PowerShell in this `backend` directory:

```powershell
mvn spring-boot:run '-Dspring-boot.run.profiles=bootstrap'
```

Then visit http://localhost:8080/actuator/health . Expected: `{"status":"UP"}`.

Run tests:
```powershell
mvn test
```

## 2. Start PostgreSQL (Milestone 16.2)
```powershell
docker compose up -d
mvn spring-boot:run
```

This connects to the development PostgreSQL database. No schema migrations are provided yet: we will create the first Flyway migration in Milestone 16.2. Never use the example development password in production.

## Why these libraries?
- **WebFlux:** reactive HTTP and future streaming endpoints.
- **R2DBC + r2dbc-postgresql:** nonblocking application queries to PostgreSQL.
- **JDBC PostgreSQL driver + Flyway PostgreSQL module:** Flyway runs versioned migrations over JDBC; it does not use R2DBC.
- **Validation:** validates API input DTOs.
- **Actuator:** operational health endpoint.

## Maven wrapper note
This ZIP was assembled offline rather than downloaded from Spring Initializr. It includes the Maven project files but not `mvnw.cmd`/wrapper binaries. Install Maven or, once Maven is available, run `mvn wrapper:wrapper` to generate a wrapper. Dependencies will download on your first Maven run.

## Next steps
- Add `V1__create_watchlist_stocks.sql` in `src/main/resources/db/migration`.
- Implement Watchlist entity, reactive repository, service, controller, and DTOs.
- Add Testcontainers integration tests before connecting the React frontend.
