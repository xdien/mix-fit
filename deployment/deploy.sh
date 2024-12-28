#!/bin/bash
set -e

IMAGE_TAG=$1

export GITHUB_REPOSITORY="xdien/mix-fit"
export IMAGE_TAG=$IMAGE_TAG

mkdir -p ~/.docker
echo "{\"auths\":{\"ghcr.io\":{\"auth\":\"$(echo -n "${GITHUB_USERNAME}:${GITHUB_TOKEN}" | base64)\"}}}" > ~/.docker/config.json

echo "Pulling new images..."
docker compose pull || {
    echo "Failed to pull images. Building from source..."
    docker compose build
}

echo "Restarting services..."
docker compose up -d

# Cleanup images cũ
echo "Cleaning up old images..."
docker image prune -f

rm -f ~/.docker/config.json