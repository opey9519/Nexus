# Backend (Nexus API)

An ASP.NET Core Web API that provides the REST endpoints for the Nexus platform.
It uses Entity Framework Core with PostgreSQL (Npgsql) for persistence and
ASP.NET Identity + JWT for authentication.

## Tech Stack

- .NET 10.0 (ASP.NET Core)
- Entity Framework Core 10 + Npgsql PostgreSQL provider
- ASP.NET Identity (users, roles)
- JWT bearer authentication (cookie-delivered tokens)
- Swagger / OpenAPI (development only)

## Project Structure

```
backend/NexusAPI/
├── Controllers/     # HTTP endpoints
├── DTOs/            # Data transfer objects
├── Data/            # EF Core DbContext and seeding
├── Middleware/      # Exception handling and other middleware
├── Migrations/      # EF Core database migrations
├── Models/          # Entity models
├── Services/        # Business logic and interfaces
├── Program.cs       # Application entry point and DI wiring
├── appsettings.json # Configuration
└── NexusAPI.csproj  # Project / package references
```

## Data Models

| Model             | Purpose                                      |
|-------------------|----------------------------------------------|
| `ApplicationUserModel` | User, extends `IdentityUser`, has profile |
| `UserProfile`      | Extended profile metadata for a user        |
| `FoodEntry`        | Food / nutrition entry (calories, macros)   |
| `WaterEntry`       | Hydration entry (mL)                        |
| `BodyweightEntry`  | Body weight entry (lbs, timestamp)          |
| `LiftEntry`        | Workout set (exercise, weight, reps, RPE)   |
| `RefreshToken`     | Long-lived refresh token for session renew  |

All user-owned entries reference the owning user via `UserId` and inherit
Identity's user model.

## Controllers & Endpoints

| Controller           | Base route          | Description                          |
|----------------------|---------------------|--------------------------------------|
| `AuthController`     | `/api/auth`         | Login, register, token refresh       |
| `FoodEntryController`| `/api/food`         | CRUD for food/nutrition entries      |
| `WaterEntryController`| `/api/water`       | CRUD for hydration entries           |
| `WeightEntryController`| `/api/weight`     | CRUD for body weight entries         |
| `LiftController`     | `/api/lifts`        | CRUD for workout / lift sets         |
| `UserController`     | `/api/user`         | User profile management              |
| `HealthController`   | `/api/health`       | Health check (used by the ALB)       |

## Authentication

- **Sign up / sign in**: handled by `AuthService` using ASP.NET Identity.
- **JWT**: signed with a symmetric key (`Jwt:Key`). Config in `Jwt` section:
  - `Key` (signing secret, supplied via secrets)
  - `Issuer` (`NexusAPI`)
  - `Audience` (`NexusUsers`)
  - `DurationInMinutes`
- **Delivery**: tokens are returned via cookies (`access_token`, `refresh_token`).
- **Validation**: `Program.cs` wires JWT bearer auth; controller actions are
  protected with `[Authorize]`.

Password policy: minimum 8 characters, at least one uppercase letter, at least
one digit; unique emails required.

## Database

- PostgreSQL via Npgsql / EF Core.
- Connection string: `ConnectionStrings:DefaultConnection`.
- Migrations live in `Migrations/` and are applied to create the schema.

## Configuration / Environment Variables

The API is configured entirely through environment variables / config (for
containerized and cloud deployment):

| Variable                              | Purpose                          |
|---------------------------------------|----------------------------------|
| `ConnectionStrings__DefaultConnection`| Postgres connection string       |
| `Jwt__Key`                            | JWT signing secret               |
| `Jwt__Issuer`                         | Token issuer (`NexusAPI`)        |
| `Jwt__Audience`                       | Token audience (`NexusUsers`)    |
| `Jwt__DurationInMinutes`              | Token lifetime (60)              |
| `ASPNETCORE_ENVIRONMENT`              | `Development` / `Production`     |

## Running Locally

The API is built to be run inside Docker with docker-compose (see
[docker/docker-compose.yml](../docker/docker-compose.yml)); it listens on port
`5181` by default.

```bash
# From the repo root
docker compose up --build api
```

Swagger is available in development at `http://localhost:5181/swagger`.

## Health Check

`GET /api/health` returns `200 OK` with `{ status: "healthy" }`. This is the
endpoint used by the load balancer health check in the AWS deployment.

## Tests

Integration/unit tests live under `backend/NexusAPI.Tests`.

```bash
dotnet test NexAPI.Tests/     # or the solution
```
