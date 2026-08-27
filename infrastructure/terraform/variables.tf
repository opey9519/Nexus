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
  description = "CIRD block for Nexus VPC"
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

variable "database_name" {
  description = "PostgreSQL database name"
  type        = string
  default     = "nexusdb"
}

variable "database_username" {
  description = "PostgreSQL username"
  type        = string
  sensitive   = true
}

variable "database_password" {
  description = "PostgreSQL password"
  type        = string
  sensitive   = true
}
