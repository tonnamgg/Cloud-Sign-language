# Cloud Sign Language Game

This project is a sign-language learning game with a React frontend, a FastAPI backend, and AWS infrastructure managed with Terraform/OpenTofu.

## What it includes

- Frontend: React + TypeScript + Vite
- Backend: FastAPI + Uvicorn
- Authentication: AWS Cognito
- Hosting: AWS Amplify for the frontend
- Deployment: AWS ECS, RDS, API Gateway, Cognito, and related networking resources through Terraform

## Project layout

```text
Cloud-Sign-language/
    backend/        FastAPI application
    frontend/       React application
    Terraform/      Infrastructure as code
```

## Requirements

- Node.js 18 or newer
- Python 3.10 or newer
- AWS account with permissions for ECS, RDS, Cognito, Amplify, IAM, VPC, and API Gateway
- Terraform 1.6+ or OpenTofu 1.6+
- GitHub repository for Amplify hosting
- A GitHub access token is mandatory if you want Terraform to build and deploy Amplify for you

## Local development

### 1. Backend

Create `backend/.env` from `backend/.env.example` and fill in the Cognito values.

```env
COGNITO_REGION=us-east-1
USER_POOL_ID=<your-user-pool-id>
APP_CLIENT_ID=<your-app-client-id>
```

Run the backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend URL:

- API: `http://localhost:8000`
- Docs: `http://localhost:8000/docs`

### 2. Frontend

Create `frontend/.env` from `frontend/.env.example` and set your Cognito values.

Run the frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

- `http://localhost:5173`

## Deploy to AWS

The Terraform configuration is in `Terraform/`. Update `terraform.tfvars` from `terraform.tfvars.example` before applying.

### 1. Prepare `terraform.tfvars`

Set these required values:

```hcl
aws_region = "us-east-1"
db_password = "ChangeMe123!"
image_uri   = "<your-ecr-image-uri>"

amplify_project_name = "Cloud-Sign-Language"
amplify_app_name     = "Cloud-Sign-Language-frontend"
amplify_repository   = "https://github.com/<your-org>/<your-repo>"
amplify_branch_name  = "main"
amplify_app_root     = "frontend"

cognito_domain_prefix = "cloud-sign-language-auth-unique-prefix"
cognito_callback_urls = ["http://localhost:5173"]
cognito_logout_urls   = ["http://localhost:5173"]

api_cors_allowed_origins = ["http://localhost:5173"]
```

If you want Terraform to manage the Amplify build, store the GitHub access token in AWS Secrets Manager and set `amplify_access_token_secret_name`.

### 2. Build and publish the backend image

Build the backend container and push it to ECR, then copy the final image URI into `image_uri`.

### 3. Apply infrastructure

From the `Terraform/` directory:

```bash
tofu init
tofu plan
tofu apply
```

If you use Terraform instead of OpenTofu, the commands are the same except for the binary name.

## How to use the app

1. Open the deployed frontend URL.
2. Sign up or sign in through Cognito.
3. Allow camera access when prompted.
4. Start a game session and follow the sign-language prompts.
5. View your score on the leaderboard.

## API endpoints

- `GET /user/me` - current user profile
- `POST /user/login-log` - record login
- `POST /user/logout-log` - record logout
- `GET /user/session-check` - session heartbeat
- `GET /leaderboard/leaderboard` - leaderboard data
- `POST /leaderboard/score` - submit score
- `POST /game/start` - start a game session
- `POST /game/detect` - detect sign input



