#!/usr/bin/env bash
set -euo pipefail

# --- Paths ---
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

# --- PIDs ---
BACKEND_PID=""
REVERB_PID=""
FRONTEND_PID=""

cleanup() {
  echo "⏹  Stopping all servers…"
  [[ -n "${FRONTEND_PID}" ]] && kill "${FRONTEND_PID}" 2>/dev/null || true
  [[ -n "${REVERB_PID}"   ]] && kill "${REVERB_PID}"   2>/dev/null || true
  [[ -n "${BACKEND_PID}"  ]] && kill "${BACKEND_PID}"  2>/dev/null || true
  exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# --- Helpers ---
pm_install() {
  # Detect package manager and do a deterministic install
  if command -v yarn &>/dev/null && [[ -f yarn.lock ]]; then
    echo "📦 Using Yarn (frozen lockfile)…"
    yarn install --frozen-lockfile
  elif command -v pnpm &>/dev/null && [[ -f pnpm-lock.yaml ]]; then
    echo "📦 Using PNPM (frozen lockfile)…"
    pnpm install --frozen-lockfile
  else
    if [[ -f package-lock.json ]]; then
      echo "📦 Using npm ci…"
      npm ci
    else
      echo "📦 Using npm install (no lockfile found)…"
      npm install
    fi
  fi
}

pm_dev() {
  if command -v yarn &>/dev/null && [[ -f yarn.lock ]]; then
    yarn dev
  elif command -v pnpm &>/dev/null && [[ -f pnpm-lock.yaml ]]; then
    pnpm dev
  else
    npm run dev
  fi
}
safe_frontend_install() {
  set +e
  pm_install
  STATUS=$?
  if [[ $STATUS -ne 0 ]]; then
    echo "⚠️  Install failed (code $STATUS). Cleaning node_modules and lockfile, retrying…"
    rm -rf node_modules package-lock.json
    npm cache verify
    npm cache clean --force
    pm_install
    STATUS=$?
    if [[ $STATUS -ne 0 ]]; then
      echo "❌ Frontend install failed again (code $STATUS). Check your Node/NPM versions and logs."
      exit $STATUS
    fi
  fi
  set -e
}


# --- Start Laravel ---
echo "🚀 Starting Laravel on http://127.0.0.1:8000"
cd "$BACKEND_DIR"
php artisan optimize:clear
php artisan serve --host=127.0.0.1 --port=8000 >/dev/null 2>&1 &
BACKEND_PID=$!
cd "$SCRIPT_DIR"

# --- Start Reverb (WebSocket) ---
echo "📡 Starting Reverb on ws://localhost:8080"
cd "$BACKEND_DIR"
# You can add --port=8080 if needed; Reverb reads from config/broadcasting.php
php artisan reverb:start --debug >/dev/null 2>&1 &
REVERB_PID=$!
cd "$SCRIPT_DIR"

# --- Frontend ---
echo "🌐 Starting frontend on http://localhost:3000"
cd "$FRONTEND_DIR"
safe_frontend_install
pm_dev >/dev/null 2>&1 &
FRONTEND_PID=$!
cd "$SCRIPT_DIR"

echo "✅ All servers are up:"
echo "   • Laravel:  http://127.0.0.1:8000"
echo "   • Frontend: http://localhost:3000"
echo "   • Reverb:   ws://localhost:8080"

# Wait on any process (trap will clean up)
wait
