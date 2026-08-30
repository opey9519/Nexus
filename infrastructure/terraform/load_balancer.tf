# Create AWS Application Load Balancer
resource "aws_lb" "nexus" {
  name               = "${local.name_prefix}-alb"
  internal           = false # Internet-facing load balancer
  load_balancer_type = "application"

  # Attach ALB to all public subnets
  subnets = aws_subnet.public[*].id

  security_groups = [
    aws_security_group.alb.id
  ]
}

# Where ALB should send traffic
resource "aws_lb_target_group" "api" {
  name        = "${local.name_prefix}-api"
  port        = 8080
  protocol    = "HTTP"
  target_type = "ip"

  vpc_id = aws_vpc.nexus.id

  health_check {
    path = "/api/health"
  }
}

# Where ALB is listening for traffic
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.nexus.arn

  port     = 80
  protocol = "HTTP"

  default_action {
    type = "forward"

    target_group_arn = aws_lb_target_group.api.arn
  }
}
