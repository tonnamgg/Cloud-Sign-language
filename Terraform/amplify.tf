locals {
  amplify_frontend_url = "https://${aws_amplify_branch.frontend.branch_name}.${aws_amplify_app.frontend.id}.amplifyapp.com"
  api_backend_url      = aws_apigatewayv2_stage.backend.invoke_url

  amplify_access_token_effective = (
    var.amplify_access_token != null && trimspace(var.amplify_access_token) != ""
    ? var.amplify_access_token
    : try(data.aws_secretsmanager_secret_version.amplify_access_token[0].secret_string, null)
  )
}

data "aws_secretsmanager_secret_version" "amplify_access_token" {
  count     = var.amplify_access_token_secret_name != null && trimspace(var.amplify_access_token_secret_name) != "" ? 1 : 0
  secret_id = var.amplify_access_token_secret_name
}

data "aws_iam_policy_document" "amplify_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["amplify.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "amplify_service_role" {
  name               = "leaderboard-amplify-service-role"
  assume_role_policy = data.aws_iam_policy_document.amplify_assume_role.json
}

resource "aws_iam_role_policy_attachment" "amplify_service_role_policy" {
  role       = aws_iam_role.amplify_service_role.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess-Amplify"
}

resource "aws_iam_role_policy_attachment" "amplify_backend_deploy_policy" {
  role       = aws_iam_role.amplify_service_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmplifyBackendDeployFullAccess"
}

resource "aws_amplify_app" "frontend" {
  name         = var.amplify_app_name
  repository   = var.amplify_repository
  access_token = local.amplify_access_token_effective
  iam_service_role_arn = aws_iam_role.amplify_service_role.arn
  platform     = "WEB"

  environment_variables = {
    VITE_COGNITO_REGION = var.aws_region
    VITE_USER_POOL_ID    = aws_cognito_user_pool.frontend_users.id
    VITE_APP_CLIENT_ID   = aws_cognito_user_pool_client.frontend_app.id
    VITE_API_BASE_URL    = local.api_backend_url
  }

  custom_rule {
    source = "</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|ttf|map|json)$)([^.]+$)/>"
    status = "200"
    target = "/index.html"
  }

  depends_on = [
    aws_iam_role_policy_attachment.amplify_service_role_policy,
    aws_iam_role_policy_attachment.amplify_backend_deploy_policy
  ]
}

resource "aws_amplify_branch" "frontend" {
  app_id            = aws_amplify_app.frontend.id
  branch_name       = var.amplify_branch_name
  framework         = "React"
  stage             = "PRODUCTION"
  enable_auto_build = true
}