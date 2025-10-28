# Deployment Setup

This repository uses a custom GitHub Actions workflow to deploy to Vercel, replacing the Vercel GitHub App integration.

## 🚀 Quick Setup (Action Required)

To enable the new deployment workflow, you need to configure three secrets in the repository:

1. **Go to Repository Settings**:
   - Navigate to: `Settings` → `Secrets and variables` → `Actions`
   - Click "New repository secret"

2. **Add the following secrets**:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

See the sections below for how to obtain these values.

## Required Secrets

The following secrets need to be configured in the repository settings (Settings → Secrets and variables → Actions):

### VERCEL_TOKEN
- **Description**: Vercel authentication token
- **How to obtain**:
  1. Go to [Vercel Account Settings → Tokens](https://vercel.com/account/tokens)
  2. Create a new token with appropriate scope
  3. Copy the token value

### VERCEL_ORG_ID
- **Description**: Your Vercel organization ID
- **How to obtain**:
  1. Run `vercel login` locally
  2. Run `vercel link` in the project directory
  3. Find the `orgId` in the generated `.vercel/project.json` file

### VERCEL_PROJECT_ID
- **Description**: Your Vercel project ID
- **How to obtain**:
  1. Run `vercel login` locally
  2. Run `vercel link` in the project directory
  3. Find the `projectId` in the generated `.vercel/project.json` file

## How it Works

The workflow (`.github/workflows/vercel-deploy.yml`) automatically:
- Deploys preview environments for all pull requests
- Deploys to production when changes are pushed to the `main` branch
- Comments on pull requests with the preview deployment URL
- Provides reliable deployment status for PR checks

## Migration from Vercel GitHub App

If you previously used the Vercel GitHub App:
1. Configure the required secrets (see above)
2. Uninstall the Vercel GitHub App from the repository:
   - Go to repository Settings → Integrations → Vercel
   - Click "Configure" and then "Uninstall"
3. The custom workflow will handle all deployments going forward
