# Shared trust policy - allows ECS tasks to assume the role
locals {
  ecs_assume_role_policy = {
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  }
}

# ECS Task Execution Role
# Used by the ECS agent to pull images and send logs to CloudWatch
resource "aws_iam_role" "ecs_execution" {
  name               = "${local.name_prefix}-ecs-execution-role"
  assume_role_policy = jsonencode(local.ecs_assume_role_policy)
}

# Attach the managed policy with ECR pull + CloudWatch logs permissions
resource "aws_iam_role_policy_attachment" "ecs_execution" {
  role       = aws_iam_role.ecs_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# ECS Task Role
# Used by the application (container) itself to reach other AWS services
resource "aws_iam_role" "ecs_task" {
  name               = "${local.name_prefix}-ecs-task-role"
  assume_role_policy = jsonencode(local.ecs_assume_role_policy)
}

# Least-privilege: allow the task role to read only the secrets it needs
resource "aws_iam_policy" "ecs_task_secrets" {
  name        = "${local.name_prefix}-ecs-task-secrets"
  description = "Allow the ECS task to read its runtime secrets"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = ["secretsmanager:GetSecretValue"]
        Resource = [
          aws_secretsmanager_secret.neon_database_url.arn,
          aws_secretsmanager_secret.jwt_key.arn,
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_secrets" {
  role       = aws_iam_role.ecs_task.name
  policy_arn = aws_iam_policy.ecs_task_secrets.arn
}
