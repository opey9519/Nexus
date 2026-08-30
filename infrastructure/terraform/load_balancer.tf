# Application Load Balancer
# Optional - only created when var.create_alb = true (user counters a public
# entry point). The ALB bills hourly regardless of traffic, so keep it off for
# dev and enable only during demos.
resource "aws_lb" "nexus" {
  count              = var.create_alb ? 1 : 0
  name               = "${local.name_prefix}-alb"
  internal           = false # Internet-facing load balancer
  load_balancer_type = "application"

  subnets         = aws_subnet.public[*].id
  security_groups = [aws_security_group.alb.id]

  tags = local.common_tags
}

# API Target Group
# Where the ALB should send API traffic. The .NET API listens on port 5181.
resource "aws_lb_target_group" "api" {
  count       = var.create_alb ? 1 : 0
  name        = "${local.name_prefix}-api"
  port        = 5181
  protocol    = "HTTP"
  target_type = "ip"

  vpc_id = aws_vpc.nexus.id

  health_check {
    path                = "/api/health"
    healthy_threshold   = 2
    unhealthy_threshold = 3
    interval            = 30
    timeout             = 5
  }

  depends_on = [aws_lb.nexus]

  tags = local.common_tags
}

# HTTP Listener
resource "aws_lb_listener" "http" {
  count             = var.create_alb ? 1 : 0
  load_balancer_arn = aws_lb.nexus[0].arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api[0].arn
  }
}
