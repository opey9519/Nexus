resource "aws_secretsmanager_secret" "jwt_key" {
  name = "${local.name_prefix}/jwt-key"
}

resource "aws_secretsmanager_secret" "database_password" {
  name = "${local.name_prefix}/database-password"
}
