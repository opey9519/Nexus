output "vpc_id" {
  description = "ID of the Nexus VPC"
  value       = aws_vpc.nexus.id
}

output "ecr_api_repository_url" {
  description = "ECR repository URL for the API"
  value       = aws_ecr_repository.api.repository_url
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = aws_ecs_cluster.nexus.name
}

output "load_balancer_dns" {
  description = "DNS name of the Nexus load balancer (only when create_alb = true)"
  value       = var.create_alb ? aws_lb.nexus[0].dns_name : null
}

output "neon_database_url" {
  description = "Neon PostgreSQL connection string secret ARN"
  value       = aws_secretsmanager_secret.neon_database_url.arn
}
