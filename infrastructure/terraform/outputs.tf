output "vpc_id" {
  description = "ID of the Nexus VPC"
  value       = aws_vpc.nexus.id
}

output "ecr_api_repository_url" {
  description = "ECR repository URL for the API"
  value       = aws_ecr_repository.api.repository_url
}

output "ecs_cluser_name" {
  description = "ECS cluster name"
  value       = aws_ecs_cluster.nexus.name
}

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint"
  value       = aws_db_instance.nexus.address
}

output "load_balancer_dns" {
  description = "DNS name of the Nexus load balancer"
  value       = aws_lb.nexus.dns_name
}
