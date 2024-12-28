#!/bin/bash
set -e

IMAGE_TAG=$1

# Export GitHub repository name for docker-compose
export GITHUB_REPOSITORY="xdien/mix-fit"
export IMAGE_TAG=$IMAGE_TAG

# Pull latest images
docker compose pull

# Restart services
docker compose up -d

# Cleanup old images
docker image prune -f