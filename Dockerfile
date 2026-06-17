# Multi-stage Dockerfile for fantasy-builder-fe
# Supports multi-project setup via VITE_PROJECT build arg

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --no-audit --no-fund

# Copy source code and configs
COPY . .

# Build argument for project selection (e.g., LOCAL_FANTASY)
ARG VITE_PROJECT
ENV VITE_PROJECT=${VITE_PROJECT}

# Copy project-specific env files and assets
# The choose_app.mjs tool would normally do this, but we do it manually in Docker
RUN if [ -n "$VITE_PROJECT" ] && [ -d "configs/$VITE_PROJECT" ]; then \
		cp -r configs/$VITE_PROJECT/env/.env* . 2>/dev/null || true; \
		cp configs/$VITE_PROJECT/index.html . 2>/dev/null || true; \
		cp -r configs/$VITE_PROJECT/public/* public/ 2>/dev/null || true; \
	else \
		echo "Warning: VITE_PROJECT not set or config not found. Using defaults."; \
	fi

# Build the application
RUN npm run build

# Stage 2: Production
FROM nginx:1.27-alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
	CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
