#!/bin/bash
# 🚀 Solo Leveling Fitness — Deploy Script
# Uso: bash scripts/deploy.sh
# Builds frontend, sincroniza a prod, reinicia servidor
# El backend corre con tsx (no necesita build compilado)

set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PROD_SSH="prod"
PROD_PATH="/var/www/solo-leveling-fitness"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

echo "╔══════════════════════════════════════╗"
echo "║   SOLO LEVELING — DEPLOY            ║"
echo "║   $TIMESTAMP UTC" 
echo "╚══════════════════════════════════════╝"
echo ""

cd "$PROJECT_DIR"

# 1. Build frontend
echo "📦 [1/3] Building frontend..."
npm run build 2>&1 | tail -2
FRONTEND_SIZE=$(du -sh dist/ 2>/dev/null | cut -f1)
echo "   → dist/ ($FRONTEND_SIZE)"

# 2. Rsync to production
echo "📡 [2/3] Uploading to production..."
rsync -az --delete \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='server/node_modules' \
  --exclude='plans/' \
  --exclude='*.md' \
  --include='scripts/' \
  "$PROJECT_DIR/dist/" "$PROD_SSH:$PROD_PATH/dist/"
rsync -az --delete \
  --exclude='node_modules' \
  --exclude='data/' \
  "$PROJECT_DIR/server/" "$PROD_SSH:$PROD_PATH/server/"
echo "   ✅ Upload complete"

# 3. Install server deps + restart
echo "🔥 [3/3] Restarting server..."
ssh prod "
  cd $PROD_PATH/server
  
  # Install deps if needed
  if [ ! -d node_modules ]; then
    npm install --no-fund --no-audit 2>&1 | tail -1
  fi
  
  # Kill existing server if running
  fuser -k 3001/tcp 2>/dev/null || true
  sleep 1
  
  # Start new server
  nohup /usr/bin/npx tsx src/index.ts >> /var/log/solo-leveling.log 2>&1 &
  disown
  sleep 2
  
  # Verify it's up
  for i in \$(seq 1 10); do
    if curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3001/api/health 2>/dev/null | grep -q 200; then
      echo '   ✅ Server running on port 3001'
      break
    fi
    sleep 1
  done
" 2>&1

echo ""
echo "╔══════════════════════════════════════╗"
echo "║   ✅ DEPLOY COMPLETE                 ║"
echo "║   https://solo-fitnessling.educortez.com/  ║"
echo "╚══════════════════════════════════════╝"
