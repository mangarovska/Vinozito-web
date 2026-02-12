#!/bin/bash
#
# Media Compression Script for Vinozito
# Compresses large video/audio files to reduce Docker build context size
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PUBLIC_DIR="${1:-./frontend/public}"
BACKUP_DIR="${PUBLIC_DIR}/original-media-backup"
COMPRESS_VIDEOS=true
COMPRESS_AUDIO=true

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

# Display usage
usage() {
    cat << EOF
Usage: $0 [PUBLIC_DIR] [OPTIONS]

Compress media files to reduce Docker build context size.

ARGUMENTS:
    PUBLIC_DIR    Path to public directory (default: ./frontend/public)

OPTIONS:
    --backup-only    Only create backups, don't compress
    --restore        Restore original files from backup
    --dry-run        Show what would be done without making changes
    -h, --help       Show this help message

EXAMPLES:
    # Compress media in default location
    $0

    # Compress media in custom location
    $0 ./frontend/public

    # Preview changes without applying
    $0 --dry-run

    # Restore original files
    $0 --restore

EOF
}

# Check if ffmpeg is installed
check_ffmpeg() {
    if ! command -v ffmpeg &> /dev/null; then
        print_error "ffmpeg is not installed. Please install it first:"
        print_info "  Ubuntu/Debian: sudo apt-get install ffmpeg"
        print_info "  macOS: brew install ffmpeg"
        print_info "  Or use Docker: docker run --rm -v \"\$PWD:/work\" jrottenberg/ffmpeg"
        exit 1
    fi
}

# Get file size in human readable format
get_file_size() {
    local file="$1"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        stat -f%z "$file" | awk '{print $1/1024/1024 " MB"}'
    else
        stat -c%s "$file" | awk '{print $1/1024/1024 " MB"}'
    fi
}

# Get file size in bytes
get_file_size_bytes() {
    local file="$1"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        stat -f%z "$file"
    else
        stat -c%s "$file"
    fi
}

# Format bytes to human readable
format_bytes() {
    local bytes=$1
    awk 'BEGIN {
        split("B KB MB GB TB PB", unit)
        u = 1
        while ($1 >= 1024) {
            $1 = $1 / 1024
            u++
        }
        printf "%.2f %s", $1, unit[u]
    }' <<< "$bytes"
}

# Compress video file
compress_video() {
    local input="$1"
    local output="$2"
    local dry_run="$3"
    
    # Get original size
    local orig_size=$(get_file_size_bytes "$input")
    
    if [ "$dry_run" = true ]; then
        print_info "[DRY-RUN] Would compress: $(basename "$input") ($(format_bytes $orig_size))"
        return
    fi
    
    print_info "Compressing video: $(basename "$input")"
    
    # Compression settings for web (good quality, smaller size)
    # -c:v libx264: H.264 codec (widely supported)
    # -crf 28: Quality setting (lower = better quality, 23-28 is good)
    # -preset medium: Compression speed/quality tradeoff
    # -movflags +faststart: Enables streaming
    # -c:a aac: AAC audio codec
    # -b:a 128k: Audio bitrate
    ffmpeg -i "$input" \
        -c:v libx264 \
        -crf 28 \
        -preset medium \
        -movflags +faststart \
        -c:a aac \
        -b:a 128k \
        -y \
        "$output" 2>/dev/null
    
    local new_size=$(get_file_size_bytes "$output")
    local saved=$((orig_size - new_size))
    local percent=$(awk "BEGIN {printf \"%.1f\", ($saved/$orig_size)*100}")
    
    print_success "  Saved: $(format_bytes $saved) ($percent% reduction)"
}

# Compress audio file
compress_audio() {
    local input="$1"
    local output="$2"
    local dry_run="$3"
    
    local orig_size=$(get_file_size_bytes "$input")
    
    if [ "$dry_run" = true ]; then
        print_info "[DRY-RUN] Would compress: $(basename "$input") ($(format_bytes $orig_size))"
        return
    fi
    
    print_info "Compressing audio: $(basename "$input")"
    
    # Compression settings for background music
    # -c:a libmp3lame: MP3 codec
    # -q:a 4: Quality (0-9, lower is better, 4 is good for music)
    # -ar 44100: Sample rate
    ffmpeg -i "$input" \
        -c:a libmp3lame \
        -q:a 4 \
        -ar 44100 \
        -y \
        "$output" 2>/dev/null
    
    local new_size=$(get_file_size_bytes "$output")
    local saved=$((orig_size - new_size))
    local percent=$(awk "BEGIN {printf \"%.1f\", ($saved/$orig_size)*100}")
    
    print_success "  Saved: $(format_bytes $saved) ($percent% reduction)"
}

# Create backup
create_backup() {
    local file="$1"
    local backup_path="$BACKUP_DIR/$(dirname "$file" | sed "s|$PUBLIC_DIR||")"
    
    mkdir -p "$backup_path"
    cp "$file" "$backup_path/"
}

# Main compression function
run_compression() {
    local dry_run=$1
    
    check_ffmpeg
    
    if [ ! -d "$PUBLIC_DIR" ]; then
        print_error "Public directory not found: $PUBLIC_DIR"
        exit 1
    fi
    
    print_info "=========================================="
    print_info "Media Compression Script"
    print_info "=========================================="
    print_info "Target directory: $PUBLIC_DIR"
    print_info "Backup directory: $BACKUP_DIR"
    [ "$dry_run" = true ] && print_warning "DRY RUN MODE - No changes will be made"
    echo ""
    
    # Create backup directory
    if [ "$dry_run" = false ]; then
        mkdir -p "$BACKUP_DIR"
    fi
    
    local total_original=0
    local total_compressed=0
    local processed=0
    
    # Find and compress video files
    if [ "$COMPRESS_VIDEOS" = true ]; then
        print_info "Processing video files..."
        while IFS= read -r file; do
            [ -z "$file" ] && continue
            
            local orig_size=$(get_file_size_bytes "$file")
            total_original=$((total_original + orig_size))
            
            if [ "$dry_run" = false ]; then
                create_backup "$file"
                compress_video "$file" "$file" false
            else
                compress_video "$file" "$file" true
            fi
            
            local new_size=$(get_file_size_bytes "$file")
            total_compressed=$((total_compressed + new_size))
            processed=$((processed + 1))
        done < <(find "$PUBLIC_DIR" -type f \( \
            -iname "*.mp4" -o \
            -iname "*.mov" -o \
            -iname "*.webm" -o \
            -iname "*.avi" \
        \) 2>/dev/null)
    fi
    
    # Find and compress audio files
    if [ "$COMPRESS_AUDIO" = true ]; then
        print_info "Processing audio files..."
        while IFS= read -r file; do
            [ -z "$file" ] && continue
            
            local orig_size=$(get_file_size_bytes "$file")
            total_original=$((total_original + orig_size))
            
            if [ "$dry_run" = false ]; then
                create_backup "$file"
                compress_audio "$file" "$file" false
            else
                compress_audio "$file" "$file" true
            fi
            
            local new_size=$(get_file_size_bytes "$file")
            total_compressed=$((total_compressed + new_size))
            processed=$((processed + 1))
        done < <(find "$PUBLIC_DIR" -type f \( \
            -iname "*.mp3" -o \
            -iname "*.wav" -o \
            -iname "*.ogg" \
        \) 2>/dev/null)
    fi
    
    echo ""
    print_info "=========================================="
    if [ "$dry_run" = true ]; then
        print_info "DRY RUN Complete - $processed files would be processed"
    else
        print_success "Compression Complete!"
        print_info "Files processed: $processed"
        print_info "Original size:   $(format_bytes $total_original)"
        print_info "Compressed size: $(format_bytes $total_compressed)"
        local saved=$((total_original - total_compressed))
        local percent=0
        if [ $total_original -gt 0 ]; then
            percent=$(awk "BEGIN {printf \"%.1f\", ($saved/$total_original)*100}")
        fi
        print_success "Total saved:     $(format_bytes $saved) ($percent%)"
        print_info ""
        print_info "Backups stored in: $BACKUP_DIR"
        print_info "To restore originals, run: $0 --restore"
    fi
    print_info "=========================================="
}

# Restore original files
restore_originals() {
    if [ ! -d "$BACKUP_DIR" ]; then
        print_error "Backup directory not found: $BACKUP_DIR"
        exit 1
    fi
    
    print_info "Restoring original media files..."
    
    local restored=0
    while IFS= read -r file; do
        [ -z "$file" ] && continue
        
        # Calculate relative path
        local rel_path="${file#$BACKUP_DIR}"
        local target="$PUBLIC_DIR$rel_path"
        
        if [ -f "$target" ]; then
            cp "$file" "$target"
            print_success "Restored: $rel_path"
            restored=$((restored + 1))
        fi
    done < <(find "$BACKUP_DIR" -type f 2>/dev/null)
    
    print_success "Restored $restored files"
}

# Parse arguments
DRY_RUN=false
RESTORE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --restore)
            RESTORE=true
            shift
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        -*)
            print_error "Unknown option: $1"
            usage
            exit 1
            ;;
        *)
            PUBLIC_DIR="$1"
            shift
            ;;
    esac
done

# Run
if [ "$RESTORE" = true ]; then
    restore_originals
else
    run_compression "$DRY_RUN"
fi
