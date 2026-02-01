# ==========================
# Stage 1: Build the Vite app
# ==========================
FROM node:18 AS build

WORKDIR /app

# Copy only package.json (NOT package-lock.json!)
COPY package.json ./

# Fresh install inside Docker (gets Linux-compatible rollup/esbuild)
RUN npm install --legacy-peer-deps

# Copy rest of the app (but exclude lockfile & node_modules via .dockerignore)
COPY . .

# Rebuild native deps for Linux
RUN npm rebuild esbuild

# Build production files
RUN npm run build


# ==========================
# Stage 2: Serve with Nginx
# ==========================
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Optional: custom nginx.conf for React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
