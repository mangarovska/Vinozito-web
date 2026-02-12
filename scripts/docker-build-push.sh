#!/bin/bash
#
# Docker Build and Push Script for Vinozito
# Builds and pushes frontend and backend images to Docker Hub
# OPTIMIZED: Uses BuildKit for faster parallel builds
#

set -e

# Enable Docker BuildKit for faster builds
export DOCKER_BUILDKIT=1
export BUILDKIT_PROGRESS=plain

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default configuration
DOCKER_USERNAME="nnikolovskii"
VERSION="1.0.0"
BUILD_FRONTEND=true
BUILD_BACKEND=true
PUSH=true
PARALLEL=true

# Image names
FRONTEND_IMAGE="${DOCKER_USERNAME}/vinozito-frontend"
BACKEND_IMAGE="${DOCKER_USERNAME}/vinozito-backend"

# Function to print colored output
print_info() {
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

# Function to display usage
usage() {
    cat << EOF
Usage: $0 [OPTIONS]

Build and push Docker images for Vinozito frontend and backend.

OPTIONS:
    -v, --version VERSION    Set image version tag (default: 1.0.0)
    -u, --username USERNAME  Docker Hub username (default: nnikolovskii)
    -f, --frontend-only      Build/push only frontend image
    -b, --backend-only       Build/push only backend image
    --no-push                Build only, don't push to registry
    --sequential             Build sequentially (default: parallel)
    -h, --help               Show this help message

EXAMPLES:
    # Build and push both images with default version
    $0

    # Build and push with custom version
    $0 -v 1.1.0

    # Build and push only frontend
    $0 --frontend-only

    # Build only (no push)
    $0 --no-push

EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -v|--version)
            VERSION="$2"
            shift 2
            ;;
        -u|--username)
            DOCKER_USERNAME="$2"
            shift 2
            ;;
        -f|--frontend-only)
            BUILD_BACKEND=false
            shift
            ;;
        -b|--backend-only)
            BUILD_FRONTEND=false
            shift
            ;;
        --no-push)
            PUSH=false
            shift
            ;;
        --sequential)
            PARALLEL=false
            shift
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            usage
            exit 1
            ;;
    esac
done

# Update image names with username
FRONTEND_IMAGE="${DOCKER_USERNAME}/vinozito-frontend"
BACKEND_IMAGE="${DOCKER_USERNAME}/vinozito-backend"

print_info "=========================================="
print_info "Docker Build & Push Script (Optimized)"
print_info "=========================================="
print_info "Version:        $VERSION"
print_info "Docker User:    $DOCKER_USERNAME"
print_info "Build Frontend: $BUILD_FRONTEND"
print_info "Build Backend:  $BUILD_BACKEND"
print_info "Parallel Build: $PARALLEL"
print_info "Push Images:    $PUSH"
print_info "BuildKit:       ENABLED"
print_info "=========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed or not in PATH"
    exit 1
fi

# Check if user is logged in to Docker Hub if pushing
if [ "$PUSH" = true ]; then
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running"
        exit 1
    fi
    
    if ! docker info 2>/dev/null | grep -q "Username"; then
        print_warning "You may not be logged in to Docker Hub"
        print_info "Run 'docker login' to authenticate"
        read -p "Continue anyway? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
fi

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Common build args for BuildKit
BUILD_ARGS="--build-arg BUILDKIT_INLINE_CACHE=1"

# Function to build frontend
build_frontend() {
    print_info "Building Frontend Image..."
    print_info "Image: ${FRONTEND_IMAGE}:${VERSION}"
    
    cd "$PROJECT_ROOT/frontend"
    
    # Use cache-from for layer caching
    docker build \
        $BUILD_ARGS \
        --cache-from "${FRONTEND_IMAGE}:latest" \
        -t "${FRONTEND_IMAGE}:${VERSION}" \
        -t "${FRONTEND_IMAGE}:latest" \
        -f Dockerfile \
        .
    
    print_success "Frontend image built successfully"
    
    if [ "$PUSH" = true ]; then
        print_info "Pushing Frontend image to Docker Hub..."
        docker push "${FRONTEND_IMAGE}:${VERSION}"
        docker push "${FRONTEND_IMAGE}:latest"
        print_success "Frontend image pushed: ${FRONTEND_IMAGE}:${VERSION}"
    fi
}

# Function to build backend
build_backend() {
    print_info "Building Backend Image..."
    print_info "Image: ${BACKEND_IMAGE}:${VERSION}"
    
    cd "$PROJECT_ROOT/backend"
    
    docker build \
        $BUILD_ARGS \
        --cache-from "${BACKEND_IMAGE}:latest" \
        -t "${BACKEND_IMAGE}:${VERSION}" \
        -t "${BACKEND_IMAGE}:latest" \
        -f Dockerfile \
        .
    
    print_success "Backend image built successfully"
    
    if [ "$PUSH" = true ]; then
        print_info "Pushing Backend image to Docker Hub..."
        docker push "${BACKEND_IMAGE}:${VERSION}"
        docker push "${BACKEND_IMAGE}:latest"
        print_success "Backend image pushed: ${BACKEND_IMAGE}:${VERSION}"
    fi
}

# Build images (parallel or sequential)
if [ "$PARALLEL" = true ] && [ "$BUILD_FRONTEND" = true ] && [ "$BUILD_BACKEND" = true ]; then
    print_info "Building images in PARALLEL mode..."
    
    # Run both builds in background
    build_frontend &
    FRONTEND_PID=$!
    
    build_backend &
    BACKEND_PID=$!
    
    # Wait for both and capture exit codes
    wait $FRONTEND_PID
    FRONTEND_EXIT=$?
    
    wait $BACKEND_PID
    BACKEND_EXIT=$?
    
    # Check results
    if [ $FRONTEND_EXIT -ne 0 ] || [ $BACKEND_EXIT -ne 0 ]; then
        print_error "One or more builds failed!"
        exit 1
    fi
else
    # Sequential build
    if [ "$BUILD_FRONTEND" = true ]; then
        build_frontend
    fi
    
    if [ "$BUILD_BACKEND" = true ]; then
        build_backend
    fi
fi

echo ""
print_info "=========================================="
print_success "Build process completed!"
print_info "=========================================="

if [ "$PUSH" = true ]; then
    echo ""
    print_info "Pushed images:"
    [ "$BUILD_FRONTEND" = true ] && echo "  - ${FRONTEND_IMAGE}:${VERSION}"
    [ "$BUILD_BACKEND" = true ] && echo "  - ${BACKEND_IMAGE}:${VERSION}"
else
    echo ""
    print_info "Built images (not pushed):"
    [ "$BUILD_FRONTEND" = true ] && echo "  - ${FRONTEND_IMAGE}:${VERSION}"
    [ "$BUILD_BACKEND" = true ] && echo "  - ${BACKEND_IMAGE}:${VERSION}"
    echo ""
    print_info "To push images, run: docker push <image-name>"
fi

echo ""
print_info "To deploy on the server:"
print_info "  docker-compose -f docker-compose.server.yml pull"
print_info "  docker-compose -f docker-compose.server.yml up -d"
