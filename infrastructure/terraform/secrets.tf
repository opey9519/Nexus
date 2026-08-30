# Neon Database Connection
# Postgres is hosted on Neon (serverless, scale-to-zero) instead of AWS RDS.
# Only the connection string secret is stored here; the value is provided at
# apply time via var.neon_database_url (sensitive).
resource "aws_secretsmanager_secret" "neon_database_url" {
  name = "${local.name_prefix}/neon-database-url"
  tags = local.common_tags
}

resource "aws_secretsmanager_secret_version" "neon_database_url" {
  secret_id     = aws_secretsmanager_secret.neon_database_url.id
  secret_string = var.neon_database_url
}

# JWT Signing Key
resource "aws_secretsmanager_secret" "jwt_key" {
  name = "${local.name_prefix}/jwt-key"
  tags = local.common_tags
}

resource "aws_secretsmanager_secret_version" "jwt_key" {
  secret_id     = aws_secretsmanager_secret.jwt_key.id
  secret_string = var.jwt_key
}
