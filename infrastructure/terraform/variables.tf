variable "aws_region" {
  description = "AWS region where Nexus will be deployed"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Name of project"
  type        = string
  default     = "Nexus"
}

variable "vpc_cidr" {
  description = "CIDR block for Nexus VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones used by Nexus"
  type        = list(string)
  default = [
    "us-east-1a",
    "us-east-1b"
  ]
}

# Whether to provision the internet-facing ALB.
# Kept off by default for cost: the ALB bills hourly regardless of traffic.
# Enable (demo mode) only when you want a public, internet-facing entry point.
variable "create_alb" {
  description = "Whether to create the internet-facing Application Load Balancer"
  type        = bool
  default     = false
}

# Fargate task sizing for the API
variable "fargate_cpu" {
  description = "CPU units (vCPU * 1024) for the API task"
  type        = number
  default     = 256
}

variable "fargate_memory" {
  description = "Memory (MiB) for the API task"
  type        = number
  default     = 512
}

variable "desired_count" {
  description = "Number of running API tasks per service"
  type        = number
  default     = 1
}

variable "neon_database_url" {
  description = "Neon PostgreSQL connection string (see docs/infrastructure). SSL required."
  type        = string
  sensitive   = true
}

variable "jwt_key" {
  description = "JWT signing key used by the API"
  type        = string
  sensitive   = true
}
