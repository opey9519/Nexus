# VPC
# Virtual private network for all Nexus resources
resource "aws_vpc" "nexus" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${local.name_prefix}-vpc"
  }
}

# Internet Gateway
# Provides a path to the public internet for public resources (e.g. ALB)
resource "aws_internet_gateway" "nexus" {
  vpc_id = aws_vpc.nexus.id

  tags = {
    Name = "${local.name_prefix}-igw"
  }
}

# Public subnets
# Host public-facing resources (e.g. the optional demo ALB) across AZs
resource "aws_subnet" "public" {
  count      = length(var.availability_zones)
  vpc_id     = aws_vpc.nexus.id
  cidr_block = cidrsubnet(var.vpc_cidr, 8, count.index)

  tags = {
    Name = "${local.name_prefix}-public-${count.index + 1}"
  }
}

# Private subnets
# Host private resources (ECS tasks) across AZs
resource "aws_subnet" "private" {
  count      = length(var.availability_zones)
  vpc_id     = aws_vpc.nexus.id
  cidr_block = cidrsubnet(var.vpc_cidr, 8, count.index + 10)

  tags = {
    Name = "${local.name_prefix}-private-${count.index + 1}"
  }
}

# Public route table - routes traffic to the internet via the IGW
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.nexus.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.nexus.id
  }

  tags = {
    Name = "${local.name_prefix}-public-rtb"
  }
}

resource "aws_route_table_association" "public" {
  count          = length(var.availability_zones)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# Private route table - local only (no NAT gateway to keep cost down)
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.nexus.id

  tags = {
    Name = "${local.name_prefix}-private-rtb"
  }
}

resource "aws_route_table_association" "private" {
  count          = length(var.availability_zones)
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}
