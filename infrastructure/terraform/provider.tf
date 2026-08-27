# Configure the AWS Provider
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "Nexus"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}
