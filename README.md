# Nexus

**Nexus**: _a means of connection; tie; link; a connected series or group; the core or center, as of a matter or situation._

> **Nexus is a cloud-native full-stack application** designed to help athletes, lifters, and performance-driven individuals track, analyze, and optimize their daily habits. It consolidates training, nutrition, hydration, and progress tracking into a single intuitive platform.

Many athletes rely on multiple disconnected apps to track workouts and PRs, nutrition and macros, hydration, and body weight. This fragmentation leads to poor data visibility and inconsistent tracking. Nexus fixes this by centralizing all performance data into one unified system.

## Tech Stack

| Layer        | Technology                                                        |
|--------------|-------------------------------------------------------------------|
| Frontend     | Next.js (App Router), React, TypeScript, Tailwind CSS            |
| Backend      | C# / ASP.NET Core, Entity Framework Core, ASP.NET Identity, JWT  |
| Database     | PostgreSQL (hosted on Neon, serverless)                          |
| Infrastructure| AWS (ECS Fargate, ECR, IAM, Secrets Manager, optional ALB)       |
| IaC          | Terraform                                                        |
| Containers   | Docker / docker-compose                                          |
| CI/CD        | GitHub Actions (planned)                                         |

## Features

- **Training**: log workouts, sets, reps, weights, and RPE; track PRs.
- **Nutrition**: record food entries with calories and macro breakdowns.
- **Hydration**: log water intake throughout the day.
- **Body composition**: track body weight and progress over time.
- **Authentication**: secure accounts with JWT-based auth and refresh tokens.

## Repository Layout

```
Nexus/
├── backend/              # ASP.NET Core Web API
├── frontend/             # Next.js (React, TypeScript) application
├── docker/               # Dockerfiles + docker-compose (local dev)
├── infrastructure/
│   └── terraform/        # AWS infrastructure as code
├── docs/                 # Project documentation
└── doc/                  # Legacy design artifacts (stale, deprecated)
```

## Architecture

A scalable, production-grade architecture defined in code, run on demand to keep
personal-project costs near zero.

- **Frontend** is served by **Vercel** (free tier).
- **API** runs on **AWS ECS Fargate**, optionally behind an **Application Load
  Balancer** during demos.
- **Database** is **Neon** (serverless PostgreSQL, scale-to-zero, free tier).

```
Browser -> Vercel (Next.js) -> [ALB (optional)] -> ECS API :5181 -> Neon Postgres
```

See the [architecture overview](docs/architecture.md) and
[infrastructure docs](docs/infrastructure/README.md) for details and diagrams.

## Documentation

Documentation lives in the [docs](docs/README.md) directory:

- [Architecture](docs/architecture.md)
- [Backend](docs/backend/README.md)
- [Frontend](docs/frontend/README.md)
- [Infrastructure](docs/infrastructure/README.md)

## Local Development

For a fully local stack (frontend + API + Postgres), use docker-compose:

```bash
# 1. Configure secrets in docker/.env (gitignored)
cd docker
# edit .env with your POSTGRES_* and JWT_KEY values

# 2. Start the stack
docker compose up --build
```

This brings up:

- **postgres** on port `5433`
- **api** (NexusAPI) on port `5181` (Swagger at `http://localhost:5181/swagger`)
- **frontend** on port `3000`

### Backend only

```bash
cd backend/NexusAPI
dotnet run
```

### Frontend only

```bash
cd frontend/nexus-frontend
npm install
npm run dev
```

## Deployment

### Infrastructure (AWS)

The AWS infrastructure is defined in Terraform and follows a
**run-when-demoing** cost model (idle = ~$0/month).

```bash
cd infrastructure/terraform
terraform init
terraform plan -var neon_database_url="..." -var jwt_key="..."
terraform apply -var neon_database_url="..." -var jwt_key="..."
terraform destroy   # when done
```

See [infrastructure docs](docs/infrastructure/README.md) for full instructions.

### Frontend (Vercel)

Connect `frontend/nexus-frontend` to Vercel and set `NEXT_PUBLIC_API_URL` to
your API endpoint.

## License

See [LICENSE](LICENSE).
