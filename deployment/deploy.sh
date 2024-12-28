#!/bin/bash
set -e

# Nhận IMAGE_TAG từ tham số
IMAGE_TAG=$1

# Export các biến môi trường
export GITHUB_REPOSITORY="xdien/mix-fit"
export IMAGE_TAG=$IMAGE_TAG

# Tạo docker config directory và file
mkdir -p ~/.docker
echo "{\"auths\":{\"ghcr.io\":{\"auth\":\"$(echo -n "${GITHUB_USERNAME}:${GITHUB_TOKEN}" | base64)\"}}}" > ~/.docker/config.json

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

# Xóa docker config sau khi hoàn thành
rm -f ~/.docker/config.json