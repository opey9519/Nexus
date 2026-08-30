resource "aws_iam_role" "ecs_execution" {
  name = "${local.name_prefix}-ecs-execution-role"

  # Who is allowed to assume this role
  assume_role_policy = jsondecode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"
        # ECS tasks are allowed to assume this role
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }

        # When ECS assumes the role, AWS provides temporary credentials that ECS can use to make authorized AWS API calls.
        Action = "sts:AssumeRole"
      }
    ]
  })
}

# Attach IAM policy to ECS execution role
resource "aws_iam_role_policy_attachment" "ecs_execution" {
  role = aws_iam_role.ecs_execution.name

  # Gives the permissions commonly needed for the execution role (Pulling images from ECR & sending logs to CloudWatch)
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}
