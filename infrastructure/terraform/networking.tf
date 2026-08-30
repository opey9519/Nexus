# AWS Virtual Private Cloud 
# Creates AWS Virtual network for resources
resource "aws_vpc" "nexus" {
  cidr_block = var.vpc_cidr

  enable_dns_hostnames = true
  enable_dns_support   = true
  tags = {
    Name = "${local.name_prefix}-vpc"
  }
}

# AWS Internet Gateway
# Creates path to public internet
resource "aws_internet_gateway" "nexus" {
  vpc_id = aws_vpc.nexus.id

  tags = {
    Name = "${local.name_prefix}-igw"
  }
}

# AWS Subnet - Public
# Contains a smaller network within VPC for public-facing resources
resource "aws_subnet" "public" {
  count  = length(var.availability_zones)
  vpc_id = aws_vpc.nexus.id

  cidr_block = cidrsubnet(
    var.vpc_cidr,
    8,
    count.index
  )

  tags = {
    Name = "${local.name_prefix}-public-${count.index + 1}"
  }
}

# AWS Subnet - Private
# Contains a smaller network within VPC for private resources
resource "aws_subnet" "private" {
  count  = length(var.availability_zones)
  vpc_id = aws_vpc.nexus.id
  cidr_block = cidrsubnet(
    var.vpc_cidr,
    8,
    count.index + 10
  )

  tags = {
    Name = "${local.name_prefix}-private-${count.index + 1}"
  }
}

