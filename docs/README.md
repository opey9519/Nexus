# Nexus Documentation

Welcome to the Nexus documentation. Nexus is a cloud-native full-stack application
for athletes to track training, nutrition, hydration, and body composition in a
single unified platform.

## Quick Links

| Topic | Document |
|-------|----------|
| System architecture | [Architecture](architecture.md) |
| Backend (ASP.NET Core API) | [Backend](backend/README.md) |
| Frontend (Next.js) | [Frontend](frontend/README.md) |
| Infrastructure (AWS + Terraform) | [Infrastructure](infrastructure/README.md) |
| Repository README | [../README.md](../README.md) |

## Repository Layout

```
Nexus/
├── backend/            # ASP.NET Core Web API
├── frontend/           # Next.js (React, TypeScript) application
├── docker/             # Dockerfiles and docker-compose for local development
├── infrastructure/
│   └── terraform/      # AWS infrastructure as code
├── docs/               # This documentation
└── doc/                # Legacy design artifacts (stale, deprecated)
```

## Tech Stack

- **Backend**: C# / ASP.NET Core, Entity Framework Core, ASP.NET Identity, JWT
- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS
- **Database**: PostgreSQL (hosted on Neon, serverless)
- **Infrastructure**: AWS (ECS Fargate, ECR, IAM, Secrets Manager, optional ALB) via Terraform
- **Containers**: Docker / docker-compose
- **CI/CD**: GitHub Actions (planned)
