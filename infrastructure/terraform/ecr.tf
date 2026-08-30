# AWS Elastic Container Registry
# CI/CD will eventually upload docker images to ECR -> ECS will then pull images from ECR to run services
resource "aws_ecr_repository" "api" {
  name                 = "${local.name_prefix}-api"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "frontend" {
  name = "${local.name_prefix}-frontend"

  image_scanning_configuration {
    scan_on_push = true
  }
}
