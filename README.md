# Mix-Fit Integration Platform

![Build Status](https://github.com/xdien/mix-fit/actions/workflows/pr-check.yaml/badge.svg)
![Deploy Status](https://github.com/xdien/mix-fit/actions/workflows/deploy.yml/badge.svg)

## Overview

Mix-Fit is an integration platform built following Clean Architecture principles, focusing on IoT device connectivity and management. This project is developed based on software development best practices and modern design patterns.

### Key Features

- Clean Architecture with distinct layers
- Dependency Injection for loose coupling
- Domain-Driven Design (DDD) for business logic modeling
- Repository pattern for data access
- JWT Authentication for security
- API Documentation with Swagger
- TypeScript for type safety

## Project Structure

```
src/
├── application/        # Use cases & application logic
│   ├── dtos/          # Data Transfer Objects
│   ├── ports/         # Ports (interfaces) for adapters
│   └── services/      # Application services
├── domain/            # Business logic & entities
│   ├── entities/      # Domain entities
│   ├── repositories/  # Repository interfaces
│   └── value-objects/ # Value objects
├── infrastructure/    # External concerns & implementations
│   ├── config/        # Configuration
│   ├── database/      # Database setup & migrations
│   └── repositories/  # Repository implementations
└── interfaces/        # API & external interfaces
    ├── controllers/   # REST controllers
    ├── middlewares/   # HTTP middlewares
    └── routes/        # Route definitions
```

## Getting Started

```bash
# 1. Clone repository
git clone git@github.com:xdien/mix-fit.git

# 2. Navigate to directory
cd mix-fit

# 3. Create environment file
cp .env.example .env

# 4. Install dependencies
yarn install
```

## Development

```bash
# Start dependent services
docker compose up -d

# Run application in development mode
yarn watch:dev

# API documentation available at: http://localhost:3000/documentation
```

### Database Migrations

```bash
# Generate new migration
yarn typeorm migration:generate -d ./src/infrastructure/database/datasource.ts migration-name

# Run migrations
yarn typeorm migration:run
```

## Build & Deploy

```bash
# Build application
yarn build:prod

# Build output in /dist directory
```

## Features

- **Clean Architecture**: Separation of concerns, testable and maintainable
- **Type Safety**: TypeScript with strict mode
- **API Documentation**: Integrated Swagger UI
- **Authentication**: JWT implementation
- **Database**: TypeORM with PostgreSQL
- **Testing**: Jest for unit & integration tests
- **Code Quality**: ESLint + Prettier
- **Hot Reload**: Rapid development with nodemon
- **IoT Support**: Integrated MQTT Broker (Mosquitto)
- **Device Control**: 11-byte protocol for efficient device control
- **Dynamic Module Loading**: Runtime module loading

## Documentation

Detailed documentation available in `docs/` directory:

1. [Architecture & Design](docs/architecture.md)
2. [Development Guide](docs/development.md)
3. [API Guidelines](docs/api-guidelines.md)
4. [Testing Strategy](docs/testing.md)

## Testing

The project follows a comprehensive testing strategy:

```bash
# Run all tests
yarn test

# Run unit tests
yarn test:unit

# Run integration tests
yarn test:integration

# Generate test coverage
yarn test:coverage
```

## Code Quality

We maintain high code quality standards:

- ESLint for code linting
- Prettier for code formatting
- Husky for pre-commit hooks
- Jest for testing
- SonarQube for code analysis

```bash
# Run linting
yarn lint

# Fix linting issues
yarn lint:fix

```

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
