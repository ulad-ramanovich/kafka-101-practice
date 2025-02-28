# Kafka Event Processing with TypeScript

This project demonstrates a modern event processing system using Apache Kafka, implementing CloudEvents specification with Avro schema validation. It's built with TypeScript and uses several modern technologies for reliable event processing.

## Requirements

- Node.js >= 18 (recommended to use NVM)
- pnpm >= 8
- Docker and Docker Compose

## Technologies Used

### Core Components

1. **Apache Kafka** (via KafkaJS)
   - Used for event streaming and message processing
   - Provides reliable, scalable event distribution
   - Running on port `9992` (custom port to avoid conflicts)

2. **Schema Registry** (Confluent)
   - Manages and validates Avro schemas
   - Ensures data consistency
   - Available at `http://localhost:9981`

3. **CloudEvents**
   - Implements CloudEvents specification for standardized event format
   - Provides interoperability between services
   - Uses Avro for efficient serialization

4. **Redpanda console**
   - Web interface for Kafka management
   - Available at `http://localhost:9980`
   - Features:
     - Topic management
     - Message browsing
     - Consumer group monitoring

### Development Stack

- **TypeScript** - Type-safe development
- **tsx** - Fast TypeScript execution with Node.js
- **KafkaJS** - Modern Kafka client for Node.js
- **Avro** - Efficient schema-based serialization
- **pnpm** - Fast, disk space efficient package manager
- **nvm** - Node Version Manager for consistent Node.js versions

## Project Setup

### Node.js Setup with NVM

This project uses NVM to manage Node.js versions. If you haven't installed NVM yet:

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell configuration
source ~/.bashrc  # or source ~/.zshrc for Zsh

# Verify NVM installation
nvm --version

# Install and use the correct Node.js version
nvm install
nvm use
```

The project includes an `.nvmrc` file that specifies the required Node.js version. When you run `nvm install` or `nvm use`, it will automatically use the version specified in this file.

### Package Management

This project uses pnpm for dependency management. If you haven't installed pnpm yet:

```bash
# Install pnpm globally
npm install -g pnpm

# Verify installation
pnpm --version
```

Configuration files:
- `.nvmrc` - Node.js version specification
- `.npmrc` - pnpm configuration
- `package.json` - Includes pnpm-specific settings
- `.gitignore` - Configured for pnpm

### Getting Started

1. **Setup Node.js Environment**
   ```bash
   nvm install
   nvm use
   ```

2. **Start the Infrastructure**
   ```bash
   docker compose up -d
   ```

3. **Install Dependencies**
   ```bash
   pnpm install
   ```

4. **Run the Consumer**
   ```bash
   pnpm start:consumer
   ```

5. **Run the Producer**
   ```bash
   pnpm start:producer
   ```

### Development Scripts

```bash
# Type checking
pnpm type-check

# Build the project
pnpm build

# Run consumer
pnpm start:consumer

# Run producer
pnpm start:producer
```

## Features

- **Schema Validation** - All messages are validated against Avro schema
- **CloudEvents Format** - Standardized event format
- **Manual Commit** - Explicit message commitment after processing
- **Error Handling** - Robust error handling with retries
- **Colored Logging** - Clear console output with color coding

## URLs and Ports

- Kafka Broker: `localhost:9992`
- Schema Registry: `http://localhost:9981`
- AKHQ (Kafka UI): `http://localhost:9980`

## Message Processing Flow

1. Producer creates a CloudEvent with:
   - Unique ID
   - Timestamp
   - Event type
   - Source information
   - Avro-serialized payload

2. Consumer:
   - Receives the message
   - Validates against Avro schema
   - Processes the CloudEvent
   - Manually commits offset

## Error Handling

The system implements a robust error handling strategy:
- Retry mechanism with exponential backoff
- Manual offset commitment
- Proper error logging
- Graceful shutdown handling

## Monitoring

Access AKHQ at `http://localhost:9980` to:
- View topics and messages
- Monitor consumer groups
- Check cluster health
- Manage schemas

## Best Practices Implemented

1. **Schema Evolution** - Using Avro for forward/backward compatibility
2. **Message Validation** - Schema Registry enforcement
3. **Error Handling** - Comprehensive error management
4. **Monitoring** - Integration with AKHQ
5. **Type Safety** - Full TypeScript implementation
6. **Standards** - CloudEvents specification compliance
7. **Package Management** - Using pnpm for efficient dependency management

## Project Configuration

### pnpm Configuration (.npmrc)
```
engine-strict=true
auto-install-peers=true
strict-peer-dependencies=false
shamefully-hoist=true
```

### Node.js Requirements
```json
"engines": {
  "node": ">=18",
  "pnpm": ">=8"
}
```

## Notes

- Custom ports (99**) are used to avoid conflicts with existing services
- Manual commit strategy ensures reliable message processing
- CloudEvents format ensures interoperability
- Avro schemas provide efficient serialization and validation
- Using pnpm for faster, more efficient package management
