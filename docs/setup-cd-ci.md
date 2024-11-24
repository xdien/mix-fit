# Setup CD/CI

## Continuous Deployment and Continuous Integration

Continuous Deployment and Continuous Integration are two important practices in software development

### Project structure

```bash
project/
├── src/
├── Dockerfile             # File build image
├── .gitignore
├── .env.example
├── .github/
│   └── workflows/
│       └── deploy.yml    # CI/CD workflow
└── deployment/
    ├── docker-compose.yml  # File compose for production
    └── deploy.sh          # Script deploy on server
```

### Setup GitHub Container Registry

```bash
# Login to GitHub
# Go to Settings -> Developer settings -> Personal access tokens(classic)
# Click on Generate new token:
#    - read:packages
#    - write:packages
#   - delete:packages
# Save the token
```

### Create SSH key for server

```bash
# In your local machine
ssh-keygen -t ed25519 -C "your_email@example.com"
# Enter a file in which to save the key (~/.ssh/id_deploy_app)

# Copy public key to server
ssh-copy-id -i ~/.ssh/id_deploy_app user@host
# Copy the content of private key
cat ~/.ssh/id_deploy_app
```

### Setup GitHub Secrets

```bash
# Go to your repository -> Secrets and variables > Actions
# Add new repository secret:
#    - SSH_HOST: Your server IP
#    - SSH_USERNAME: Your server user
#    - SSH_KEY: Your private key (~/.ssh/id_deploy_app)
#    - REGISTRY_USERNAME: Your GitHub username
#    - REGISTRY_TOKEN: Your GitHub token(In step Setup GitHub Container Registry)
```

### Setup on server production

```bash
# Create a directory for the project
sudo mkdir -p /opt/app/deployment
sudo chown -R youruser:youruser /opt/app

# 2. Copy deployment files
cd /opt/app/deployment
scp user@local-machine:/path/to/project/deployment/* .

# 3. Login to GitHub Container Registry
# Create Personal Access Token with read:packages
export CR_PAT=YOUR_TOKEN
echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin

# 4. Create .env file
cp .env.example .env
nano .env

# 5. Permissions excute deploy.sh
chmod +x deploy.sh
```

### Localy deploy

```bash
# Build image
docker build -t ghcr.io/your-username/your-repo:test .

# Test with docker-compose
GITHUB_REPOSITORY=your-username/your-repo IMAGE_TAG=test docker compose up
```
