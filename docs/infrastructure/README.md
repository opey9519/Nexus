# Infrastructure (AWS + Terraform)

This document describes the AWS infrastructure for Nexus, defined as code with
Terraform. The infrastructure is designed to be **production-grade in code but
cost-effective in practice** for a personal/dev project.

## Design Goals

1. **Scalable & secure architecture** for showcasing cloud engineering skills.
2. **Cost-efficient**: ~$0/month when idle (run-when-demoing model).
3. **Modern stack**: ECS Fargate for compute, Neon for serverless Postgres.

## Architecture

```
                    +---------------------+
                    |     Internet        |
                    +----------+----------+
                               |
                               v
            +------------------+------------------+
            |  ALB (optional)                      |
            |  var.create_alb = true (demo mode)   |
            |  public subnets, port 80             |
            +------------------+------------------+
                               |
                               v
            +------------------+------------------+
            |  ECS Fargate - API (:5181)          |
            |  private subnets, across 2 AZs      |
            |  IAM task role (least privilege)    |
            |  Secrets Manager: Neon URL, JWT key |
            |  CloudWatch logs                    |
            +------------------+------------------+
                               |
                               | PostgreSQL (TLS)
                               v
                    +-----------------------------+
                    |  Neon (serverless Postgres) |
                    |  free tier, scale-to-zero   |
                    +-----------------------------+
```

Note: The frontend is hosted on **Vercel** (free tier) and is not part of the
AWS deployment.

## Terraform Layout

```
infrastructure/terraform/
├── provider.tf        # AWS provider + default tags
├── versions.tf        # Required Terraform / provider versions
├── variables.tf       # Input variables
├── locals.tf          # Naming / tagging helpers
├── networking.tf      # VPC, subnets, IGW, route tables
├── security_groups.tf # ALB + ECS security groups
├── ecs.tf             # ECS cluster, task definition, service
├── ecr.tf             # Container image repository
├── iam.tf             # ECS execution + task IAM roles
├── secrets.tf         # Secrets Manager (Neon URL, JWT key)
├── cloudwatch.tf      # Log groups
├── load_balancer.tf   # Optional ALB + target group + listener
└── outputs.tf         # Useful output values
```

## Component Details

### Networking (`networking.tf`)

- **VPC**: `10.0.0.0/16` with DNS hostname + support enabled.
- **Public subnets**: one per AZ (`10.0.*.0/24`), attached to a public route
  table with `0.0.0.0/0 -> Internet Gateway` (used by the optional ALB).
- **Private subnets**: one per AZ (`10.0.1[0-1].0/24`), attached to a private
  route table that is **local-only** (no NAT gateway) to keep cost down.
- No NAT gateway: Fargate pulls images via the ECS execution role (works
  without a task NAT), and the API's only outbound dependency is Neon/HTTPS.

### Security Groups (`security_groups.tf`)

- **ALB SG**: inbound HTTP `:80` from `0.0.0.0/0`; full egress.
- **ECS SG**: inbound `:5181` **only from the ALB SG**; full egress (to reach
  Neon, CloudWatch, ECR).

### Compute (`ecs.tf`) & Images (`ecr.tf`)

- **ECS cluster** on Fargate.
- **API task** (`nexus-api`): `awsvpc` network mode, Fargate compat,
  256 CPU / 512 MB, container port `5181` (matches `Dockerfile.api`).
- Container env: `ASPNETCORE_ENVIRONMENT=Production`, `Jwt__Issuer`,
  `Jwt__Audience`, `Jwt__DurationInMinutes`.
- Container secrets (from Secrets Manager): `ConnectionStrings__DefaultConnection`
  and `Jwt__Key`.
- **ECR repository**: API images, immutable tags, scan on push.

### IAM (`iam.tf`)

- **ECS execution role**: allows the ECS agent to pull images and write logs
  (`AmazonECSTaskExecutionRolePolicy`).
- **ECS task role**: allows the application to read its secrets
  (`secretsmanager:GetSecretValue` scoped to the two secrets) - least privilege.

### Secrets (`secrets.tf`)

Two secrets in AWS Secrets Manager, value injected at apply time:

- `neon-database-url`: the Neon PostgreSQL connection string.
- `jwt-key`: the JWT signing key.

These are referenced by the ECS task via `valueFrom` and the task role is
granted read access.

### Observability (`cloudwatch.tf`)

- `/ecs/<prefix>/api` log group with 14-day retention, wired to the API task's
  `awslogs` driver.

### Load Balancer (`load_balancer.tf`) - optional

- Only created when `var.create_alb = true` (demo mode).
- Listens on `:80`, forwards to the API target group on `:5181`.
- Health check on `GET /api/health`.

## Database (Neon)

Instead of AWS RDS, Nexus uses **Neon**, a serverless PostgreSQL platform:

- Free tier: 100 CU-hours/month, 0.5 GB storage, scale-to-zero.
- Scales to zero when idle, so it costs nothing between uses.
- Connection must use TLS (`sslmode=require`).

Set the connection string as the `neon_database_url` variable at apply time.

## Cost Model (run-when-demoing)

| State                          | Monthly cost                 |
|--------------------------------|------------------------------|
| **Idle** (nothing applied)     | ~$0 (Neon free tier)         |
| **Demo** (applied for hours)   | ~$0.05-0.10 per hour         |

Because the ALB bills hourly regardless of traffic (~$22/mo) and ECS/RDS bill
by uptime, the project uses an **apply-to-demo, destroy-when-done** workflow to
keep the bill near zero.

## Terraform Workflow

Prerequisites: Terraform >= 1.9, AWS CLI credentials, and the required
variables (Neon URL, JWT key).

```bash
cd infrastructure/terraform

# 1. Initialize (downloads providers)
terraform init

# 2. Plan (dry run)
terraform plan \
  -var neon_database_url="postgresql://user:password@host/db?sslmode=require" \
  -var jwt_key="<your-jwt-secret>"

# 3. Apply (provision) - add -var create_alb=true for a public entry point
terraform apply \
  -var neon_database_url="..."
  -var jwt_key="..."
  -var create_alb=false

# 4. Tear down when done demoing
terraform destroy
```

### Useful Commands

| Command                 | Purpose                                  |
|-------------------------|------------------------------------------|
| `terraform fmt`         | Format code                              |
| `terraform validate`    | Validate configuration                   |
| `terraform plan`        | Dry-run preview of changes               |
| `terraform apply`       | Apply changes (provision resources)      |
| `terraform destroy`     | Remove all resources                     |

## Security Notes

- Secrets are stored in AWS Secrets Manager, never in Terraform state plaintext
  (values supplied as sensitive variables).
- Only the API port is exposed, and only from the ALB SG.
- No public IPs on tasks (private subnets).
- IAM uses least-privilege roles.
- ECR images are scanned on push and tags are immutable.
