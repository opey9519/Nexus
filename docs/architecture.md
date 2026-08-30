# Architecture

## Product Overview

Nexus consolidates multiple fragmented fitness-tracking tools into one platform.
Athletes and lifters can track and analyze:

- Workouts and PRs
- Nutrition and macros
- Hydration
- Body weight and progress

The goal is to give performance-driven individuals a single source of truth for
their training and health data.

## Tech Stack

| Layer        | Technology                                        |
|--------------|---------------------------------------------------|
| Frontend     | Next.js (App Router), React, TypeScript, Tailwind |
| Backend      | C# / ASP.NET Core, EF Core, ASP.NET Identity, JWT |
| Database     | PostgreSQL (Neon, serverless)                     |
| Hosting      | AWS (ECS Fargate, ECR, optional ALB) + Vercel     |
| Infrastructure | Terraform                                       |
| Containers   | Docker / docker-compose                           |

## High-Level Diagram

```
                   +-------------------+
                   |     Browser      |
                   +---------+--------+
                             |
                             | HTTPS
                             v
                 +-----------+-------------+
                 |   Frontend (Next.js)   |
                 |   Hosted on Vercel     |
                 +-----------+-------------+
                             |
                             | HTTP (API calls)
                             v
                 +-----------+-------------+
                 |   Application LB (ALB) |   <-- optional, demo only
                 |   (public subnets)     |
                 +-----------+-------------+
                             |
                             v
                 +-----------+-----------------+
                 |  ECS Fargate - API (:5181) |
                 |  (private subnets)         |
                 +-----------+-----------------+
                             |
                             | PostgreSQL (TLS)
                             v
                 +-----------+-----------------+
                 |   Neon (serverless PG)     |
                 |   free tier, scale-to-zero  |
                 +-----------------------------+
```

### AWS Resources (Terraform)

```
+---------------------------------------------- AWS VPC ---------------------------------------------+
|                                                                                                   |
|  Public subnets (2 AZs)                 Private subnets (2 AZs)                                   |
|  +---------------------------+          +---------------------------+                            |
|  | Internet Gateway <-> ALB  |          | ECS Fargate service       |                            |
|  | (optional, demo only)     |          |   - API container (:5181) |                            |
|  +---------------------------+          +---------------------------+                            |
|                                                                                                   |
|  Cross-cutting:                                                                                   |
|   - IAM execution + task roles (least privilege)                                                 |
|   - Secrets Manager (Neon URL, JWT key)                                                          |
|   - CloudWatch log groups                                                                         |
|   - ECR repository (API images)                                                                  |
+---------------------------------------------------------------------------------------------------+
```

## Component Ownership

| Component        | Where it runs                     | Owner                            |
|------------------|-----------------------------------|----------------------------------|
| Frontend pages   | Vercel (free tier)                | `frontend/nexus-frontend`         |
| REST API         | AWS ECS Fargate                   | `backend/NexusAPI`                |
| Database         | Neon (serverless Postgres)        | external (Neon)                  |
| Container images | AWS ECR                          | `infrastructure/terraform/ecr.tf` |
| Networking/Security | AWS VPC, SGs, IAM            | `infrastructure/terraform`        |

## Cost Model

Nexus is a personal/dev project with a "run-when-demoing" cost strategy:

- **Idle**: AWS resources are not applied, so the bill is ~$0/month
- **Demo**: `terraform apply` provisions the stack; you pay only for hours run
  (ALB ~$0.03/hr + Fargate ~$0.01/hr = pennies per hour)
- **Database**: Neon free tier (100 CU-hours/month, 0.5 GB storage, scale-to-zero)

See [Infrastructure](infrastructure/README.md) for details.

## Data Flow

1. User interacts with the Next.js frontend (Vercel).
2. The frontend calls the REST API (`/api/*`).
3. In demo mode, the ALB routes `/api/*` to the ECS Fargate API container.
4. The API authenticates requests (JWT via cookie) and reads/writes data.
5. Persistence is handled by PostgreSQL on Neon over a TLS connection.
