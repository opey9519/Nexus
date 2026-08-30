# AWS Elastic Container Registry
# CI/CD will eventually upload Docker images to ECR, and ECS will pull them
# to run the API service.
resource "aws_ecr_repository" "api" {
  name                 = "${local.name_prefix}-api"
  image_tag_mutability = "IMMUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = local.common_tags
}
