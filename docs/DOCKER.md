# Docker Setup

This document explains how to build and run the fantasy-builder-fe application using Docker.

## Overview

The Docker setup supports the multi-project configuration architecture. You can build Docker images for different projects (e.g., `LOCAL_FANTASY`) by specifying the `VITE_PROJECT` build argument.

## Files

- `Dockerfile` - Production multi-stage build (Node.js builder + Nginx server)
- `Dockerfile.dev` - Development build with hot reload support
- `docker-compose.yml` - Orchestration for both production and development services
- `nginx.conf` - Nginx configuration for SPA routing and optimizations
- `.dockerignore` - Excludes unnecessary files from Docker build context

## Quick Start

### Production Build

Build and run the production container:

```bash
# Build for specific project
docker-compose build --build-arg VITE_PROJECT=LOCAL_FANTASY

# Run
docker-compose up -d

# Access at http://localhost:8080
```

### Development Build

Run with hot reload for development:

```bash
# Start dev service
docker-compose --profile dev up fantasy-builder-fe-dev

# Access at http://localhost:8080
```

## Building Images

### Using Docker Compose (Recommended)

```bash
# Build production image
docker-compose build

# Build for different project
docker-compose build --build-arg VITE_PROJECT=PROJECT_NAME
```

### Using Docker CLI

```bash
# Build production image
docker build \
  --build-arg VITE_PROJECT=LOCAL_FANTASY \
  -t fantasy-builder-fe:latest \
  .

# Build development image
docker build \
  --build-arg VITE_PROJECT=LOCAL_FANTASY \
  -f Dockerfile.dev \
  -t fantasy-builder-fe:dev \
  .
```

## Running Containers

### Production

```bash
# Start service
docker-compose up -d

# View logs
docker-compose logs -f

# Stop service
docker-compose down
```

### Development

```bash
# Start with hot reload
docker-compose --profile dev up fantasy-builder-fe-dev

# Stop
docker-compose --profile dev down
```

### Direct Docker Run

```bash
# Run production container
docker run -d \
  --name fantasy-builder-fe \
  -p 8080:80 \
  fantasy-builder-fe:latest

# Run development container
docker run -d \
  --name fantasy-builder-fe-dev \
  -p 8080:8080 \
  -v $(pwd):/app \
  -v /app/node_modules \
  fantasy-builder-fe:dev
```

## Multi-Project Support

The Docker setup integrates with the multi-project configuration system:

### Project Selection

Specify the project at build time:

```bash
docker build --build-arg VITE_PROJECT=LOCAL_FANTASY -t fantasy-fe:local .
docker build --build-arg VITE_PROJECT=PROJECT_TWO -t fantasy-fe:project2 .
```

### How It Works

1. The `VITE_PROJECT` build arg specifies which config folder to use
2. During build, the Dockerfile copies files from `configs/${VITE_PROJECT}/`:
   - Environment files from `env/` → root
   - `index.html` (if exists) → root
   - Assets from `public/` → root `public/`
3. The build runs with the project-specific configuration
4. Per-project overrides in `configs/${VITE_PROJECT}/src/` are included automatically

### Environment Variables

Each project's `.env` files are copied during build. To override at runtime:

```bash
docker run -d \
  -e VITE_API_URL=https://api.example.com \
  -p 8080:80 \
  fantasy-builder-fe:latest
```

**Note:** Most Vite env vars are baked into the build and cannot be changed at runtime. Rebuild the image to change them.

## Docker Compose Configuration

### Services

- **fantasy-builder-fe** - Production service (nginx-based)
- **fantasy-builder-fe-dev** - Development service with hot reload (profile: `dev`)

### Customization

Edit `docker-compose.yml` to:

- Change project: Update `VITE_PROJECT` under `build.args`
- Change port: Update `ports` mapping (e.g., `"3000:80"`)
- Add volumes: Uncomment `volumes` section to persist logs

### Profiles

Development service uses the `dev` profile:

```bash
# Start only dev service
docker-compose --profile dev up

# Start both production and dev
docker-compose --profile dev up
```

## Nginx Configuration

The `nginx.conf` includes:

- **SPA Routing** - All routes serve `index.html`
- **Gzip Compression** - Reduces bandwidth
- **Static Asset Caching** - 1-year cache for JS/CSS/images
- **Security Headers** - X-Frame-Options, X-Content-Type-Options, X-XSS-Protection
- **Health Check** - `/health` endpoint returns 200

### Custom Nginx Config

To modify nginx settings, edit `nginx.conf` and rebuild:

```bash
# Edit nginx.conf
vim nginx.conf

# Rebuild and restart
docker-compose up -d --build
```

### API Proxy

To proxy API requests, uncomment the `/api` location block in `nginx.conf`:

```nginx
location /api {
    proxy_pass http://backend-service:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

## Health Checks

Both Dockerfile and docker-compose.yml include health checks:

```bash
# Check container health
docker ps

# View health check logs
docker inspect fantasy-builder-fe | jq '.[0].State.Health'
```

Health check hits `http://localhost:80/` every 30 seconds.

## Image Optimization

### Multi-Stage Build

The production Dockerfile uses multi-stage builds:

1. **Builder stage** - Installs deps, builds app (Node.js 20 Alpine)
2. **Production stage** - Serves build output (Nginx Alpine)

Final image size: ~50MB (nginx + static assets only)

### Layer Caching

For faster rebuilds:

```bash
# Use BuildKit
DOCKER_BUILDKIT=1 docker build -t fantasy-fe .

# Or with docker-compose
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose build
```

## Troubleshooting

### Build Fails

**Problem:** `configs/${VITE_PROJECT}` not found

**Solution:** Ensure `VITE_PROJECT` matches a folder name in `configs/`:

```bash
ls configs/
# Should list: LOCAL_FANTASY, PROJECT_TWO, etc.
```

### Container Exits Immediately

**Problem:** Container stops after start

**Solution:** Check logs:

```bash
docker-compose logs fantasy-builder-fe
```

Common causes:
- Port 80 already in use (change port in `docker-compose.yml`)
- Health check failing (check nginx config)

### Hot Reload Not Working (Dev)

**Problem:** Changes not reflected in dev container

**Solution:** Ensure volume mounts are correct:

```yaml
volumes:
  - .:/app              # Mount source
  - /app/node_modules   # Exclude node_modules
```

### Permission Errors

**Problem:** EACCES errors in container

**Solution:** Use non-root user or fix permissions:

```dockerfile
# Add to Dockerfile.dev
USER node
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build Docker Image

on:
  push:
    branches: [main, uat, preprod]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build image
        run: |
          docker build \
            --build-arg VITE_PROJECT=LOCAL_FANTASY \
            -t fantasy-fe:${{ github.sha }} \
            .
      
      - name: Push to registry
        run: docker push fantasy-fe:${{ github.sha }}
```

### GitLab CI Example

```yaml
build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build --build-arg VITE_PROJECT=LOCAL_FANTASY -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
```

## Production Deployment

### Docker Swarm

```bash
docker stack deploy -c docker-compose.yml fantasy-fe
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fantasy-fe
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: fantasy-fe
        image: fantasy-builder-fe:latest
        ports:
        - containerPort: 80
```

## Best Practices

1. **Pin versions** - Use specific Node.js and Nginx versions
2. **Scan images** - Run `docker scan fantasy-builder-fe:latest`
3. **Multi-arch builds** - Support ARM64 for Apple Silicon
4. **Layer caching** - Order Dockerfile commands from least to most frequently changed
5. **Security** - Run as non-root user in production
6. **Secrets** - Use Docker secrets or env vars, never bake into image

## References

- [Vite Docker Guide](https://vitejs.dev/guide/backend-integration.html)
- [Nginx Docker Hub](https://hub.docker.com/_/nginx)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
