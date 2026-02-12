// Docker Buildx Bake configuration for parallel builds
// Usage: docker buildx bake

group "default" {
    targets = ["frontend", "backend"]
}

// Frontend target
target "frontend" {
    context = "./frontend"
    dockerfile = "Dockerfile"
    tags = [
        "nnikolovskii/vinozito-frontend:latest",
        "nnikolovskii/vinozito-frontend:1.0.0"
    ]
    cache-from = [
        "type=gha,scope=frontend",
        "nnikolovskii/vinozito-frontend:latest"
    ]
    cache-to = [
        "type=gha,scope=frontend,mode=max"
    ]
    output = ["type=docker"]
}

// Backend target
target "backend" {
    context = "./backend"
    dockerfile = "Dockerfile"
    tags = [
        "nnikolovskii/vinozito-backend:latest",
        "nnikolovskii/vinozito-backend:1.0.0"
    ]
    cache-from = [
        "type=gha,scope=backend",
        "nnikolovskii/vinozito-backend:latest"
    ]
    cache-to = [
        "type=gha,scope=backend,mode=max"
    ]
    output = ["type=docker"]
}

// Production target with push enabled
// Usage: docker buildx bake prod --push
group "prod" {
    targets = ["frontend-prod", "backend-prod"]
}

target "frontend-prod" {
    inherits = ["frontend"]
    output = ["type=registry"]
}

target "backend-prod" {
    inherits = ["backend"]
    output = ["type=registry"]
}
