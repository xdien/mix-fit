# Development Environment Setup Guide - Mix-Fit Platform

## Overview

Mix-Fit is an integration platform built following Clean Architecture principles, focusing on IoT device connectivity and management. The project uses NestJS, TypeScript, PostgreSQL, Redis, and MQTT.

## System Requirements

- **Node.js**: >= 18.x
- **Yarn**: >= 1.22 (Package manager)
- **Docker**: >= 20.x
- **Docker Compose**: >= 2.x
- **Git**: >= 2.x
- **OpenSSL**: For JWT key generation
- **VS Code**: Latest version (if using VS Code as editor)

## Step 1: Clone Repository

```bash
# Clone repository
git clone git@github.com:xdien/mix-fit.git

# Navigate to project directory
cd mix-fit
```

## Step 1.5: VS Code Extensions (if using VS Code)

Install the following required extensions for optimal development experience:

### Required Extensions:

```bash
# Install via VS Code Extensions marketplace or command line:

# Prettier - Code formatter
code --install-extension esbenp.prettier-vscode

# ESLint - JavaScript/TypeScript linting
code --install-extension dbaeumer.vscode-eslint

# TypeScript support (usually pre-installed)
code --install-extension ms-vscode.vscode-typescript-next
```

### Recommended Extensions:

```bash
# i18n Ally - Internationalization support
code --install-extension lokalise.i18n-ally

# Code Spell Checker
code --install-extension streetsidesoftware.code-spell-checker

# Docker support
code --install-extension ms-azuretools.vscode-docker


# Thunder Client - API testing (alternative to Postman)
code --install-extension rangav.vscode-thunder-client
```

### Manual Installation:

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for each extension name
4. Click "Install"

**Note**: The project's `.vscode/settings.json` is configured to work with these extensions.

## Step 2: Environment Setup

### 2.1 Create .env file

```bash
# Copy environment file from template
cp .env.example .env
```

### 2.2 Generate JWT Keys

The project uses RSA keys to sign and verify JWT tokens. You can generate keys in 2 ways:

#### Method 1: Using automated script (Recommended)

**On macOS/Linux:**

```bash
# Run automated script
./scripts/generate-jwt-keys.sh

# Script will generate keys and display format to copy to .env
```

**On Windows (PowerShell):**

```powershell
# Run automated script
.\scripts\generate-jwt-keys.ps1

# Script will generate keys and display format to copy to .env
```

#### Method 2: Manual generation

```bash
# Generate RSA private key (2048 bits)
openssl genpkey -algorithm RSA -out jwt_private_key.pem -pkeyopt rsa_keygen_bits:2048

# Generate public key from private key
openssl rsa -pubout -in jwt_private_key.pem -out jwt_public_key.pem
```

### 2.3 Update JWT Keys in .env

After running the script or manually generating keys, copy the displayed content to `.env` file:

```bash
# JWT Auth - Replace xxxx with actual content from script
JWT_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...\n-----END RSA PRIVATE KEY-----
JWT_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0B...\n-----END PUBLIC KEY-----
JWT_EXPIRATION_TIME=3600
```

**Important notes**:

- Keep the `\n` in the key strings
- No extra whitespace
- Private key must be kept absolutely secure
- Do not commit private key to git
- Remove key files after copying: `rm -rf keys/` (Linux/Mac) or `Remove-Item -Recurse -Force keys\` (Windows)

### 2.4 Configure other .env settings (optional)

Open `.env` file and adjust other settings if needed:

```bash
# Basic configuration
NODE_ENV=development
PORT=3000
TRANSPORT_PORT=8080
JWT_EXPIRATION_TIME=3600

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=main_app

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=password

# MQTT (can be disabled if not needed)
MQTT_ENABLED=false
```

## Step 3: Start Docker Services

### 3.1 Start Docker Desktop

```bash
# On macOS
open -a Docker

# Or manually start Docker Desktop
```

### 3.2 Start dependent services

```bash
# Start PostgreSQL, Redis
docker compose up -d postgres-db redis

# Check status
docker compose ps
```

### 3.3 Start MQTT (optional)

If you need to use MQTT:

```bash
# Create password file for MQTT
sudo cp mosquitto/config/.mosquitto_passwd_example mosquitto/config/.mosquitto_passwd/.mosquitto_passwd

# Start MQTT broker
docker compose up -d mqtt-broker

# Enable MQTT in .env
# Change MQTT_ENABLED=false to MQTT_ENABLED=true
```

## Step 4: Install Yarn and Dependencies

### 4.1 Install Yarn (if not already installed)

```bash
# Install Yarn globally using npm
npm install -g yarn

# Verify Yarn installation
yarn --version

# Alternative installation methods:
# On macOS using Homebrew
brew install yarn

# On Windows using Chocolatey
choco install yarn

# On Ubuntu/Debian
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install yarn
```

### 4.2 Install Dependencies

```bash
# Install project dependencies
yarn install
```

### 4.3 Setup Husky (Git Hooks)

```bash
# Husky is automatically set up during yarn install via prepare script
# Just ensure pre-commit hook is executable
chmod +x .husky/pre-commit

# Test the pre-commit hook
yarn lint-staged
```

### 4.4 Handle dependency issues (if any)

```bash
# If you encounter vulnerabilities
yarn audit

# Fix vulnerabilities (if possible)
yarn audit fix
```

## Step 5: Database Setup

### 5.1 Run migrations

```bash
# Run migrations to create database schema
yarn migration:run
```

### 5.2 Create new migration (when needed)

```bash
# Create new migration
yarn migration:generate MigrationName
```

## Step 6: Start Application

### 6.1 Development mode with hot reload

```bash
# Start with hot reload
yarn watch:dev

# Or
yarn start:dev
```

### 6.2 Debug mode

```bash
# Start with debug mode
yarn debug:dev
```

## Step 7: Verify Application

### 7.1 API Documentation

Access Swagger UI at: http://localhost:3000/documentation

### 7.2 Health Check

```bash
# Check application health
curl http://localhost:3000/health
```

### 7.3 Database Management

- **PgAdmin**: http://localhost:8080

  - Email: example@gmail.com
  - Password: password

- **Redis Commander**: http://localhost:8081

## Step 8: Testing

### 8.1 Run tests

```bash
# Run all tests
yarn test

# Run tests with watch mode
yarn test:watch

# Run test coverage
yarn test:cov

# Run e2e tests
yarn test:e2e
```

### 8.2 Linting and Formatting

```bash
# Run linting
yarn lint

# Fix linting issues
yarn lint:fix
```

### 8.3 Git Hooks (Husky)

The project uses Husky for git hooks to ensure code quality:

```bash
# Test pre-commit hook manually
yarn lint-staged

# Pre-commit hook will automatically:
# - Run ESLint on TypeScript files
# - Format JSON files
# - Stage fixed files
```

**Note**: If you encounter issues with git commits, check the troubleshooting section for Husky fixes.

## Project Structure

```
src/
├── common/           # Shared DTOs and utilities
├── config/          # Application configuration
├── constants/       # Global constants
├── database/        # Database configuration
├── modules/         # Feature modules
│   ├── auth/        # Authentication
│   ├── user/        # User management
│   ├── iot/         # IoT device management
│   └── post/        # Post management
├── mqtt/            # MQTT client/broker
├── shared/          # Shared services
└── main.ts          # Application entry point
```

## Useful Scripts

```bash
# Setup
./scripts/generate-jwt-keys.sh    # Generate JWT RSA keys (Linux/Mac)
.\scripts\generate-jwt-keys.ps1   # Generate JWT RSA keys (Windows)
./scripts/fix-husky.sh          # Fix Husky git hooks setup

# Development
yarn watch:dev             # Hot reload development
yarn debug:dev             # Debug mode
yarn start:dev             # Simple development start

# Build
yarn build:prod            # Production build

# Database
yarn migration:generate    # Create new migration
yarn migration:run         # Run migrations
yarn migration:revert      # Revert migration

# Testing
yarn test                  # Run tests
yarn test:watch            # Watch mode
yarn test:cov             # Coverage report

# Code Quality
yarn lint                  # Linting
yarn lint:fix             # Fix linting issues
```

## Troubleshooting

### 1. Docker Issues

```bash
# Check if Docker is running
docker ps

# Restart Docker services
docker compose restart

# View logs
docker compose logs [service-name]
```

### 2. Database Connection Issues

```bash
# Check PostgreSQL
docker compose logs postgres-db

# Restart database
docker compose restart postgres-db
```

### 3. MQTT Issues

```bash
# Check MQTT logs
docker compose logs mqtt-broker

# Recreate password file
sudo cp mosquitto/config/.mosquitto_passwd_example mosquitto/config/.mosquitto_passwd/.mosquitto_passwd
```

### 4. JWT Authentication Issues

```bash
# Error: Invalid JWT keys
# Regenerate JWT keys
./scripts/generate-jwt-keys.sh

# Check key format in .env
# Ensure \n is present and no extra whitespace
```

### 5. Husky/Git Hooks Issues

```bash
# Error: yarn command not found
# Install yarn globally first
npm install -g yarn

# Error: Husky deprecated warnings or lint:prettier command not found
# Run the fix script
./scripts/fix-husky.sh

# Or manual fix:
# Update .husky/pre-commit to new format (remove deprecated lines)
echo "yarn lint-staged" > .husky/pre-commit
chmod +x .husky/pre-commit

# Test pre-commit hook manually
yarn lint-staged

# Check .husky/pre-commit content (should be simple):
cat .husky/pre-commit
# Should contain only:
# yarn lint-staged
```

### 6. VS Code Extension Issues

```bash
# Error: Prettier extension not found
# Install Prettier extension
code --install-extension esbenp.prettier-vscode

# Error: ESLint not working
# Install ESLint extension
code --install-extension dbaeumer.vscode-eslint

# Check if extensions are installed
code --list-extensions

# Reload VS Code window after installing extensions
# Command Palette (Ctrl+Shift+P) -> "Developer: Reload Window"
```

### 7. Port Conflicts

If you encounter port already in use errors:

```bash
# Check ports in use
lsof -i :3000
lsof -i :5432

# Kill process if needed
kill -9 [PID]
```

## Development Workflow

1. **Create feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Development**

   - Write code
   - Run tests: `yarn test`
   - Linting: `yarn lint:fix`

3. **Testing**

   ```bash
   yarn test:cov
   yarn test:e2e
   ```

4. **Commit and Push**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

## Environment URLs

- **Application**: http://localhost:3000
- **API Documentation**: http://localhost:3000/documentation
- **PgAdmin**: http://localhost:8080
- **Redis Commander**: http://localhost:8081
- **MQTT**: localhost:1883

## Contact & Support

- Repository: https://github.com/xdien/mix-fit
- Issues: https://github.com/xdien/mix-fit/issues

---

**Note**: This file will be updated when there are changes in project configuration.
