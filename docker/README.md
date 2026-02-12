# Vinozito Docker Setup

This directory contains Docker Compose configuration for running the Vinozito application stack.

## Services

| Service | Description | Port |
|---------|-------------|------|
| `frontend` | React + Vite application served by Nginx | 80 |
| `backend` | .NET 9.0 Web API | 5000 |
| `mongodb` | MongoDB database | 27017 |
| `mongo-express` | MongoDB web admin interface | 8081 |

## Quick Start

### 1. Configure Environment Variables

```bash
cd docker
cp .env.example .env
# Edit .env with your preferred settings
```

### 2. Start All Services

```bash
docker-compose up -d
```

### 3. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000
- **API Documentation (Swagger)**: http://localhost:5000/swagger
- **MongoDB Admin**: http://localhost:8081 (login: admin/admin123)

## Useful Commands

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d backend

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes database data)
docker-compose down -v

# Rebuild images after code changes
docker-compose up -d --build

# Check service status
docker-compose ps
```

## Development Mode

To run in development mode with hot reload:

```bash
# Uses docker-compose.override.yml automatically
docker-compose up -d

# For frontend development with Vite dev server:
# Uncomment the frontend override section in docker-compose.override.yml
# Then run:
docker-compose up -d backend mongodb
cd ../frontend && npm run dev
```

## Data Persistence

- **MongoDB data**: Stored in Docker volume `mongodb_data`
- **Uploaded files**: If uploader service is added, stored in `uploads_data`

To backup/restore MongoDB data:

```bash
# Backup
docker exec vinozito-mongodb mongodump --uri="mongodb://vinozhito_db:DgTKHt0FHG2@localhost:27017/?authSource=admin" --out=/backup

# Restore
docker exec vinozito-mongodb mongorestore --uri="mongodb://vinozhito_db:DgTKHt0FHG2@localhost:27017/?authSource=admin" /backup/vinozitoDB
```

## Troubleshooting

### Port Already in Use

If ports 80, 5000, 27017, or 8081 are already in use, modify the port mappings in `docker-compose.yml`:

```yaml
ports:
  - "8080:80"  # Use port 8080 instead of 80
```

### Database Connection Issues

Ensure MongoDB is healthy before backend starts:

```bash
docker-compose ps
# Check STATUS column shows "healthy"
```

### Rebuild After Dependency Changes

If you update `package.json` or `.csproj`:

```bash
docker-compose down
docker-compose up -d --build
```

## Adding the Uploader Service

If you have a FastAPI uploader service, add this to `docker-compose.yml`:

```yaml
uploader:
  build:
    context: ../uploader
    dockerfile: Dockerfile
  container_name: vinozito-uploader
  restart: unless-stopped
  environment:
    - UPLOAD_PASSWORD=8*8Fajlovi8*8
  ports:
    - "5001:5001"
  volumes:
    - uploads_data:/app/uploads
  networks:
    - vinozito-network
```

And add to volumes section:
```yaml
volumes:
  uploads_data:
    driver: local
```
