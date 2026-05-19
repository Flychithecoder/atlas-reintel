#!/bin/bash
set -euo pipefail

# ============================================
# Atlas - Zero-downtime deploy script
# Run from /opt/atlas on the VPS
# ============================================

APP_DIR="/opt/atlas"
cd $APP_DIR

echo ">> Pulling latest code..."
git pull origin main

echo ">> Building new image..."
docker compose build --no-cache

echo ">> Stopping old container..."
docker compose down

echo ">> Starting new container..."
docker compose up -d

echo ">> Cleaning up old images..."
docker image prune -f

echo ">> Checking health..."
sleep 5
if curl -sf http://localhost:3000 > /dev/null; then
    echo ">> Deploy successful! App is running."
else
    echo ">> WARNING: App may not be responding. Check logs:"
    echo "   docker compose logs atlas"
fi
