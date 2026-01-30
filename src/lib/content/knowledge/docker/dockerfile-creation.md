# Dockerfile Creation

A **Dockerfile** is a text file containing instructions to build a Docker image. It automates the process of creating custom container images.

## Dockerfile Structure

```dockerfile
# Syntax: instruction arguments
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Core Instructions

### FROM - Base Image

Every Dockerfile starts with a base image:

```dockerfile
FROM ubuntu:22.04                # Specific version
FROM node:24-alpine              # Alpine variant (smaller)
FROM python:3.14-slim            # Slim variant
FROM scratch                     # Empty image (for static binaries)
```

**Multi-stage builds:**

```dockerfile
FROM node:24 AS builder
# Build steps...

FROM node:24-alpine
COPY --from=builder /app/dist ./dist
```

### WORKDIR - Set Working Directory

```dockerfile
WORKDIR /app                     # Creates if doesn't exist
# Subsequent commands run from /app
```

### COPY - Copy Files

```dockerfile
COPY package.json ./             # Copy single file
COPY package*.json ./            # Wildcard pattern
COPY src/ ./src/                 # Copy directory
COPY . .                         # Copy everything
COPY --chown=user:group file /path  # Set ownership
```

### ADD - Copy with Extras

Like COPY but with additional features:

```dockerfile
ADD https://example.com/file.tar.gz /tmp/   # Download from URL
ADD archive.tar.gz /app/                     # Auto-extract archives
```

**Best practice:** Use COPY unless you need ADD's special features.

### RUN - Execute Commands

Executes commands during build:

```dockerfile
RUN apt-get update && apt-get install -y curl
RUN npm install
RUN pip install -r requirements.txt
```

**Shell form vs Exec form:**

```dockerfile
RUN echo "Hello"                 # Shell form: /bin/sh -c
RUN ["echo", "Hello"]            # Exec form: direct execution
```

**Chain commands** to reduce layers:

```dockerfile
RUN apt-get update && \
    apt-get install -y curl git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

### CMD - Default Command

Specifies the command to run when container starts:

```dockerfile
CMD ["npm", "start"]             # Exec form (preferred)
CMD npm start                    # Shell form
CMD ["python", "app.py"]
```

**Note:** Only the last CMD is used. Can be overridden at runtime.

### ENTRYPOINT - Configure Container Executable

```dockerfile
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["postgres"]                 # Default arguments
```

**Difference from CMD:**

- ENTRYPOINT: The main executable (harder to override)
- CMD: Default arguments (easily overridden)

```dockerfile
# Runtime: docker run image arg1 arg2
# Executes: ENTRYPOINT + arg1 arg2 (CMD ignored if args provided)
```

### EXPOSE - Document Ports

```dockerfile
EXPOSE 80                        # HTTP
EXPOSE 443                       # HTTPS
EXPOSE 3000                      # App port
```

**Note:** Doesn't actually publish ports. Documentation only. Use `-p` at runtime.

### ENV - Environment Variables

```dockerfile
ENV NODE_ENV=production
ENV PORT=3000 \
    LOG_LEVEL=info
```

### ARG - Build Arguments

```dockerfile
ARG VERSION=latest               # Default value
ARG BUILD_DATE

FROM node:${VERSION}
RUN echo "Built on ${BUILD_DATE}"
```

Build with arguments:

```bash
docker build --build-arg VERSION=18 --build-arg BUILD_DATE=$(date) .
```

### VOLUME - Define Mount Points

```dockerfile
VOLUME /data                     # Anonymous volume
VOLUME ["/var/log", "/var/db"]   # Multiple volumes
```

### USER - Set User

```dockerfile
RUN useradd -m appuser
USER appuser                     # Switch to non-root user
```

### LABEL - Add Metadata

```dockerfile
LABEL maintainer="dev@example.com"
LABEL version="1.0"
LABEL description="My application"
```

## Common Patterns

### Node.js Application

```dockerfile
FROM node:24-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3000

CMD ["node", "server.js"]
```

### Python Application

```dockerfile
FROM python:3.14-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create non-root user
RUN useradd -m -u 1001 appuser
USER appuser

EXPOSE 8000

CMD ["python", "app.py"]
```

### Multi-Stage Build (Go)

```dockerfile
# Build stage
FROM golang:1.25 AS builder

WORKDIR /src
COPY . .
RUN go mod download
RUN CGO_ENABLED=0 go build -o /app

# Runtime stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates
COPY --from=builder /app /app

USER nobody

ENTRYPOINT ["/app"]
```

## Best Practices

### 1. Use Specific Tags

```dockerfile
FROM node:18.17-alpine           # Good: specific version
FROM node                        # Bad: unpredictable
```

### 2. Minimize Layers

```dockerfile
# Bad: Multiple layers
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get clean

# Good: Single layer
RUN apt-get update && \
    apt-get install -y curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

### 3. Leverage Build Cache

```dockerfile
# Copy package files first (changes infrequently)
COPY package*.json ./
RUN npm install

# Copy source code last (changes frequently)
COPY . .
```

### 4. Use .dockerignore

Create `.dockerignore`:

```
node_modules
.git
.env
*.md
.DS_Store
```

### 5. Run as Non-Root

```dockerfile
RUN adduser -D appuser
USER appuser
```

### 6. Multi-Stage for Smaller Images

```dockerfile
# Build dependencies in one stage
FROM node:24 AS builder
RUN npm run build

# Runtime with minimal dependencies
FROM node:24-alpine
COPY --from=builder /app/dist ./dist
```

### 7. Security Scanning

```bash
docker scan image-name           # Scan for vulnerabilities
```

## Building Images

### Basic Build

```bash
docker build -t myapp:latest .
docker build -t myapp:v1.0 -f Dockerfile.prod .
```

### Build Arguments

```bash
docker build --build-arg VERSION=18 -t myapp .
```

### Build Context

```bash
docker build -t myapp -f path/to/Dockerfile context/
```

### No Cache

```bash
docker build --no-cache -t myapp .
```

### Target Stage

```bash
docker build --target builder -t myapp:builder .
```

## Troubleshooting

### Debug Build

```bash
docker build --progress=plain --no-cache .
```

### Build Failed at Layer

```bash
# Find image ID from build output
docker run -it <image-id> sh    # Inspect failed layer
```

### Large Image Size

```bash
docker history myapp:latest     # See layer sizes
docker image inspect myapp:latest
```

**Reduce size:**

- Use alpine or slim base images
- Multi-stage builds
- Clean up in same RUN layer
- Remove unnecessary files

## Advanced Techniques

### BuildKit Features

Enable BuildKit:

```bash
DOCKER_BUILDKIT=1 docker build .
```

**Syntax:**

```dockerfile
# syntax=docker/dockerfile:1
FROM node:24
```

### Build Secrets

```dockerfile
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm install
```

Build:

```bash
docker build --secret id=npmrc,src=$HOME/.npmrc .
```

### Cache Mounts

```dockerfile
RUN --mount=type=cache,target=/root/.npm npm install
```

### SSH Mounts

```dockerfile
RUN --mount=type=ssh git clone git@github.com:user/repo.git
```

## Testing Dockerfiles

```bash
# Build and run
docker build -t myapp .
docker run --rm myapp

# Check image
docker image inspect myapp
docker history myapp

# Security scan
docker scan myapp
```

## Next Steps

- Learn Docker Compose for multi-container applications
- Explore container registries (Docker Hub, ECR, GCR)
- Study image optimization techniques
- Understand Docker networking
- Learn container orchestration with Kubernetes
