#!/bin/bash
set -euo pipefail

# ============================================
# Atlas Real Estate Intelligence - VPS Setup
# Run as root on a fresh Ubuntu 22.04+ VPS
# ============================================

DOMAIN="atlasreintel.com"
APP_DIR="/opt/atlas"
REPO_URL=""  # Set your git repo URL here

echo "=========================================="
echo "  Atlas Real Estate Intelligence"
echo "  VPS Deployment Setup"
echo "=========================================="

# 1. System updates
echo "[1/8] Updating system..."
apt-get update && apt-get upgrade -y

# 2. Install dependencies
echo "[2/8] Installing dependencies..."
apt-get install -y curl git nginx certbot python3-certbot-nginx ufw

# 3. Install Docker
echo "[3/8] Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
fi

# Install Docker Compose plugin
if ! docker compose version &> /dev/null; then
    apt-get install -y docker-compose-plugin
fi

# 4. Firewall
echo "[4/8] Configuring firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# 5. Create app directory
echo "[5/8] Setting up application..."
mkdir -p $APP_DIR
if [ -n "$REPO_URL" ]; then
    git clone "$REPO_URL" $APP_DIR
fi

# 6. Nginx config
echo "[6/8] Configuring Nginx..."
cat > /etc/nginx/sites-available/atlas << 'NGINX'
server {
    listen 80;
    server_name atlasreintel.com www.atlasreintel.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    client_max_body_size 10M;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
}
NGINX

ln -sf /etc/nginx/sites-available/atlas /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# 7. SSL
echo "[7/8] Setting up SSL..."
echo ""
echo "  >> Make sure DNS A records point to this server BEFORE continuing:"
echo "     A  atlasreintel.com      -> $(curl -s ifconfig.me)"
echo "     A  www.atlasreintel.com  -> $(curl -s ifconfig.me)"
echo ""
read -p "Press Enter when DNS is configured..."

certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN --redirect

# 8. Deploy
echo "[8/8] Building and starting application..."
cd $APP_DIR

if [ ! -f .env.production ]; then
    echo ""
    echo "  >> Create .env.production before deploying:"
    echo "     cp .env.example .env.production"
    echo "     nano .env.production"
    echo ""
    cp .env.example .env.production
    echo "Edit .env.production with your keys, then run:"
    echo "  cd $APP_DIR && docker compose up -d --build"
else
    docker compose up -d --build
fi

echo ""
echo "=========================================="
echo "  Setup complete!"
echo ""
echo "  Next steps:"
echo "  1. Edit $APP_DIR/.env.production with your API keys"
echo "  2. Run: cd $APP_DIR && docker compose up -d --build"
echo "  3. Visit: https://$DOMAIN"
echo "=========================================="
