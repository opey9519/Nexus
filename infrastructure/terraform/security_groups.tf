# ALB Security Group
# Allows inbound HTTP from the internet and all outbound traffic
resource "aws_security_group" "alb" {
  name        = "${local.name_prefix}-alb-sg"
  description = "Security group for Nexus ALB"
  vpc_id      = aws_vpc.nexus.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${local.name_prefix}-alb-sg"
  }
}

# ECS Security Group
# Allows inbound from the ALB only; outbound freely (to Neon over the internet,
# CloudWatch logs, ECR, etc.)
resource "aws_security_group" "ecs" {
  name        = "${local.name_prefix}-ecs-sg"
  description = "Security group for Nexus ECS"
  vpc_id      = aws_vpc.nexus.id

  ingress {
    description     = "API from ALB"
    from_port       = 5181
    to_port         = 5181
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${local.name_prefix}-ecs-sg"
  }
}
