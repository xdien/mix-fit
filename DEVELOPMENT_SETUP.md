# Development Environment Setup Guide - Mix-Fit Platform

## Overview

Mix-Fit is an integration platform built following Clean Architecture principles, focusing on IoT device connectivity and management. The project uses NestJS, TypeScript, PostgreSQL, Redis, and MQTT.

## System Requirements

- **Node.js**: >= 18.x
- **npm**: >= 8.x (or yarn >= 1.22)
- **Docker**: >= 20.x
- **Docker Compose**: >= 2.x
- **Git**: >= 2.x
- **OpenSSL**: For JWT key generation

## Step 1: Clone Repository

```bash
# Clone repository
git clone git@github.com:xdien/mix-fit.git

# Navigate to project directory
cd mix-fit
```

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

## Step 4: Install Dependencies

### 4.1 Using npm

```bash
# Install dependencies
npm install

# Or if you have yarn
yarn install
```

### 4.2 Setup Husky (Git Hooks)

```bash
# Husky is automatically set up during npm install via prepare script
# Just ensure pre-commit hook is executable and uses npm
chmod +x .husky/pre-commit

# Test the pre-commit hook
npx lint-staged
```

### 4.3 Handle dependency issues (if any)

```bash
# If you encounter vulnerabilities
npm audit fix

# Or force fix (be careful)
npm audit fix --force
```

## Step 5: Database Setup

### 5.1 Run migrations

```bash
# Run migrations to create database schema
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/datasources/default.datasource.ts
```

### 5.2 Create new migration (when needed)

```bash
# Create new migration
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate -d ./src/datasources/default.datasource.ts MigrationName
```

## Step 6: Start Application

### 6.1 Development mode with hot reload

```bash
# Start with hot reload
npm run watch:dev

# Or
npm run start:dev
```

### 6.2 Debug mode

```bash
# Start with debug mode
npm run debug:dev
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
npm test

# Run tests with watch mode
npm run test:watch

# Run test coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

### 8.2 Linting and Formatting

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

### 8.3 Git Hooks (Husky)

The project uses Husky for git hooks to ensure code quality:

```bash
# Setup Husky (run once after npm install)
npx husky install

# Test pre-commit hook manually
npx lint-staged

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
npm run watch:dev          # Hot reload development
npm run debug:dev          # Debug mode
npm run start:dev          # Simple development start

# Build
npm run build:prod         # Production build

# Database
npm run migration:generate # Create new migration
npm run migration:run      # Run migrations
npm run migration:revert   # Revert migration

# Testing
npm test                   # Run tests
npm run test:watch         # Watch mode
npm run test:cov          # Coverage report

# Code Quality
npm run lint              # Linting
npm run lint:fix          # Fix linting issues
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
# Quick fix using automated script
./scripts/fix-husky.sh

# Or manual fix:
# Error: yarn command not found in pre-commit hook
# Fix: Update .husky/pre-commit to use npm instead of yarn
echo "npx lint-staged" > .husky/pre-commit

# Error: Husky deprecated warnings
# Remove deprecated lines from .husky/pre-commit:
# #!/bin/sh
# . "$(dirname "$0")/_/husky.sh"

# Ensure pre-commit hook is executable
chmod +x .husky/pre-commit

# Test pre-commit hook manually
npx lint-staged
```

### 6. Port Conflicts

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
   - Run tests: `npm test`
   - Linting: `npm run lint:fix`

3. **Testing**
   ```bash
   npm run test:cov
   npm run test:e2e
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