# 
resource "aws_db_subnet_group" "nexus" {
  name = "${local.name_prefix}-db-subnet-group"

  subnet_ids = aws_subnet.private[*].id

  tags = {
    name = "${local.name_prefix}-db-subnet-group"
  }
}

# AWS DB instance - Amazon Relational Database Service for PostgreSQL
resource "aws_db_instance" "nexus" {
  identifier = "${local.name_prefix}-postgres"

  engine         = "postgres"
  engine_version = "15"

  instance_class = "db.t4g.micro"

  allocated_storage = 20
  storage_type      = "gp3"

  db_name  = var.database_name
  username = var.database_username
  password = var.database_password

  db_subnet_group_name = aws_db_subnet_group.nexus

  vpc_security_group_ids = [
    aws_security_group.rds.id
  ]

  publicly_accessible = false

  skip_final_snapshot = true
}
