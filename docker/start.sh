#!/bin/bash

# Vinozito Docker Startup Script
# Usage: ./start.sh [dev|prod|stop|logs|clean]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi

    print_success "Docker and Docker Compose are installed"
}

# Check if .env file exists
check_env() {
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from .env.example..."
        cp .env.example .env
        print_status "Please review and update .env file with your settings"
    fi
}

# Start services
start() {
    local mode=$1
    print_status "Starting Vinozito in $mode mode..."
    
    check_env
    
    if [ "$mode" == "dev" ]; then
        docker-compose up -d
        print_success "Development services started!"
        echo ""
        echo "Services available at:"
        echo "  - Frontend:      http://localhost"
        echo "  - Backend API:   http://localhost:5000"
        echo "  - Swagger Docs:  http://localhost:5000/swagger"
        echo "  - Mongo Express: http://localhost:8081 (admin/admin123)"
    else
        docker-compose -f docker-compose.yml up -d
        print_success "Production services started!"
    fi
}

# Stop services
stop() {
    print_status "Stopping Vinozito services..."
    docker-compose down
    print_success "Services stopped"
}

# View logs
logs() {
    local service=$1
    if [ -z "$service" ]; then
        docker-compose logs -f
    else
        docker-compose logs -f "$service"
    fi
}

# Clean up (remove containers and volumes)
clean() {
    print_warning "This will remove all containers and volumes (database data will be lost!)"
    read -p "Are you sure? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v --remove-orphans
        docker system prune -f
        print_success "Cleanup complete"
    else
        print_status "Cleanup cancelled"
    fi
}

# Rebuild services
rebuild() {
    print_status "Rebuilding services..."
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    print_success "Services rebuilt and started"
}

# Main command handler
case "${1:-dev}" in
    dev|start)
        check_docker
        start "dev"
        ;;
    prod)
        check_docker
        start "prod"
        ;;
    stop|down)
        stop
        ;;
    logs)
        logs "$2"
        ;;
    clean)
        clean
        ;;
    rebuild)
        rebuild
        ;;
    status|ps)
        docker-compose ps
        ;;
    help|--help|-h)
        echo "Vinozito Docker Management Script"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  dev, start    Start services in development mode (default)"
        echo "  prod          Start services in production mode"
        echo "  stop, down    Stop all services"
        echo "  logs [svc]    View logs (optionally for specific service)"
        echo "  status, ps    Show running services"
        echo "  rebuild       Rebuild and restart all services"
        echo "  clean         Remove containers, volumes, and prune images"
        echo "  help          Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0                    # Start all services"
        echo "  $0 logs backend       # View backend logs"
        echo "  $0 logs -f            # Follow all logs"
        ;;
    *)
        print_error "Unknown command: $1"
        echo "Run '$0 help' for usage information"
        exit 1
        ;;
esac
