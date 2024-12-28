#!/bin/bash
set -e

# Nhận IMAGE_TAG từ tham số
IMAGE_TAG=$1

# Export các biến môi trường
export GITHUB_REPOSITORY="xdien/mix-fit"
export IMAGE_TAG=$IMAGE_TAG

# Login to GitHub Container Registry
echo "Logging into GitHub Container Registry..."
echo $GITHUB_TOKEN | docker login ghcr.io -u $GITHUB_USERNAME --password-stdin

# Pull images mới
echo "Pulling new images..."
docker compose pull || {
    echo "Failed to pull images. Building from source..."
    docker compose build
}

# Restart services với images mới
echo "Restarting services..."
docker compose up -d

# Cleanup images cũ
echo "Cleaning up old images..."
docker image prune -f