# Deployment Setup

This repository uses a custom GitHub Actions workflow to deploy to Vercel, replacing the Vercel GitHub App integration.

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
