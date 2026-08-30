resource "aws_ecs_cluster" "nexus" {
  name = "${local.name_prefix}-cluster"
}

resource "aws_ecs_task_definition" "api" {
  family                   = "${local.name_prefix}-api"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]

  cpu    = "256"
  memory = "512"

  execution_role_arn = aws_iam_role.ecs_execution.arn
  task_role_arn      = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name  = "nexus-api"
      image = "${aws_ecr_repository.api.repository_url}:latest"

      portMappings = [
        {
          containerPort = 8080
          protocol      = "tcp"
        }
      ]

      essential = true
    }
  ])
}

resource "aws_ecs_service" "api" {
  name = "${local.name_prefix}-api"

  cluster = aws_ecs_cluster.nexus.id

  task_definition = aws_ecs_task_definition.api.arn

  desired_count = 1

  launch_type = "FARGATE"

  network_configuration {
    subnets = aws_subnet.private[*].id

    security_groups = [
      aws_security_group.ecs.id
    ]

    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.api.arn
    container_name   = "nexus-api"
    container_port   = 8080
  }

  depends_on = [
    aws_lb_listener.http
  ]
}
