# AWS Security Group
resource "aws_security_group" "alb" {
  name        = "${local.name_prefix}-alb-sg"
  description = "Security group for Nexus ALB"
  vpc_id      = aws_vpc.nexus.id

  ingress = {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress = {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "ecs" {
  name        = "${local.name_prefix}-ecs-sg"
  description = "Security group for Nexus ECS"
  vpc_id      = aws_vpc.nexus.id

  # TODO
  ingress = {

  }

  # TODO
  egress = {

  }
}

resource "aws_security_group" "rds" {
  name        = "${local.name_prefix}-rds-sg"
  description = "Security group for Nexus PostgreSQL"
  vpc_id      = aws_vpc.nexus.id

  ingress = {
    description         = "PostgreSQL for ECS"
    from_port           = 5432
    to_port             = 5432
    protocol            = "tcp"
    aws_security_groups = [aws_security_group.ecs.id]
  }

  egress = {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
