# ==========================
# Stage 1: Build the Vite app
# ==========================
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files first for optimal layer caching
# This layer is cached unless package.json changes
COPY package.json package-lock.json* ./

# Install dependencies
# Uses npm ci for faster, reproducible builds when lockfile exists
RUN if [ -f package-lock.json ]; then \
        npm ci --legacy-peer-deps --prefer-offline --no-audit; \
    else \
        npm install --legacy-peer-deps --prefer-offline --no-audit; \
    fi

# Copy source files (including public/ which contains static assets)
COPY . .

# Build production files
# Vite will copy public/ to dist/ automatically
RUN npm run build

# ==========================
# Stage 2: Serve with Nginx (Alpine = smaller)
# ==========================
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx.conf for React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove unnecessary nginx modules to reduce image size
RUN rm -rf /usr/share/nginx/html/*.md /usr/share/nginx/html/50x.html /usr/share/nginx/html/index.html.default 2>/dev/null || true

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
