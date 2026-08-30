# ECS Cluster
resource "aws_ecs_cluster" "nexus" {
  name = "${local.name_prefix}-cluster"
}

# API Task Definition
# The ASP.NET Core API container. Port 5181 matches Dockerfile.api.
resource "aws_ecs_task_definition" "api" {
  family                   = "${local.name_prefix}-api"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]

  cpu    = var.fargate_cpu
  memory = var.fargate_memory

  execution_role_arn = aws_iam_role.ecs_execution.arn
  task_role_arn      = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name  = "nexus-api"
      image = "${aws_ecr_repository.api.repository_url}:latest"

      portMappings = [
        {
          containerPort = 5181
          protocol      = "tcp"
        }
      ]

      environment = [
        { name = "ASPNETCORE_ENVIRONMENT", value = "Production" },
        { name = "Jwt__Issuer", value = "NexusAPI" },
        { name = "Jwt__Audience", value = "NexusUsers" },
        { name = "Jwt__DurationInMinutes", value = "60" }
      ]

      # Sensitive config pulled from AWS Secrets Manager at runtime
      secrets = [
        {
          name      = "ConnectionStrings__DefaultConnection"
          valueFrom = aws_secretsmanager_secret.neon_database_url.arn
        },
        {
          name      = "Jwt__Key"
          valueFrom = aws_secretsmanager_secret.jwt_key.arn
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.api.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "api"
        }
      }

      essential = true
    }
  ])

  tags = local.common_tags
}

# API Service
resource "aws_ecs_service" "api" {
  name    = "${local.name_prefix}-api"
  cluster = aws_ecs_cluster.nexus.id

  task_definition = aws_ecs_task_definition.api.arn

  desired_count = var.desired_count
  launch_type   = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.ecs.id]
    assign_public_ip = false
  }

  # Only attach the load balancer when one exists (demo mode)
  dynamic "load_balancer" {
    for_each = var.create_alb ? [1] : []
    content {
      target_group_arn = aws_lb_target_group.api[0].arn
      container_name   = "nexus-api"
      container_port   = 5181
    }
  }

  depends_on = [
    aws_lb_listener.http
  ]

  tags = local.common_tags
}
