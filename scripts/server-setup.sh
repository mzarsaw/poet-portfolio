#!/bin/bash
set -e

echo "=== Poet Portfolio - Hetzner VPS Setup ==="

# Update system
echo "Updating system..."
apt update && apt upgrade -y

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
else
    echo "Docker already installed."
fi

# Verify Docker Compose
docker compose version

# Create app directory and uploads
mkdir -p /opt/poet-portfolio/uploads

# Create .env if it doesn't exist
if [ ! -f /opt/poet-portfolio/.env ]; then
    cat > /opt/poet-portfolio/.env << 'EOF'
# Database
POSTGRES_DB=poet_portfolio
POSTGRES_USER=poet
POSTGRES_PASSWORD=CHANGE_ME_STRONG_PASSWORD
DATABASE_URL=postgresql://poet:CHANGE_ME_STRONG_PASSWORD@db:5432/poet_portfolio

# Auth
SESSION_SECRET=CHANGE_ME_64_CHAR_RANDOM_STRING
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=CHANGE_ME_STRONG_PASSWORD

# App
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_ADMIN_URL=https://admin.yourdomain.com
NODE_ENV=production
EOF
    echo ""
    echo ">>> .env file created at /opt/poet-portfolio/.env"
    echo ">>> IMPORTANT: Edit it with your production values before deploying!"
    echo ""
else
    echo ".env already exists, skipping."
fi

# Configure firewall
echo "Configuring firewall..."
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw allow 81  # Nginx Proxy Manager admin panel
ufw --force enable

echo ""
echo "=== Setup complete ==="
echo ""
echo "Next steps:"
echo "  1. Edit /opt/poet-portfolio/.env with your production values"
echo "  2. Add these GitHub Actions secrets to your repo:"
echo "     - VPS_HOST: $(curl -s ifconfig.me)"
echo "     - VPS_USER: root"
echo "     - VPS_SSH_KEY: (your SSH private key)"
echo "  3. Push to main branch to trigger the first deployment"
echo "  4. After deploy, visit http://$(curl -s ifconfig.me):81 to set up Nginx Proxy Manager"
echo "     Default login: admin@example.com / changeme"
