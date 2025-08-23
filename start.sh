#!/usr/bin/env bash
set -e

# ---------------------------------------------------------------------------
# Helper: on exit (or Ctrl+C) kill all children
# ---------------------------------------------------------------------------
cleanup() {
  echo "⏹  Stopping all servers…"
  kill "$BACKEND_PID"  2>/dev/null || true
  kill "$REVERB_PID"   2>/dev/null || true
  kill "$FRONTEND_PID" 2>/dev/null || true
  exit 0
}
trap cleanup SIGINT SIGTERM

# ---------------------------------------------------------------------------
# 1) Start the Laravel app (Backend)
# ---------------------------------------------------------------------------
if ! pgrep -f "php artisan serve --host=127.0.0.1 --port=8000"; then
  echo "🚀 Starting Laravel on http://127.0.0.1:8000"
  cd backend
  composer i
  php artisan optimize:clear
  php artisan serve --host=127.0.0.1 --port=8000 > /dev/null 2>&1 & 
  BACKEND_PID=$!
  cd ..
else
  echo "Laravel is already running on http://127.0.0.1:8000"
  BACKEND_PID=$(pgrep -f "php artisan serve --host=127.0.0.1 --port=8000")
fi

# ---------------------------------------------------------------------------
# 2) Start the Reverb server (Laravel-specific)
# ---------------------------------------------------------------------------
if ! pgrep -f "php artisan reverb:start --host=127.0.0.1 --port=8080"; then
  echo "🌐 Starting Reverb on http://127.0.0.1:8080"
  cd backend
  php artisan reverb:start --host=127.0.0.1 --port=8080 --debug > /dev/null 2>&1 &
  REVERB_PID=$!
  cd ..
else
  echo "Reverb is already running on http://127.0.0.1:8080"
  REVERB_PID=$(pgrep -f "php artisan reverb:start --host=127.0.0.1 --port=8080")
fi

# ---------------------------------------------------------------------------
# 3) Start the front-end dev server (Vite)
# ---------------------------------------------------------------------------
if ! pgrep -f "npm run dev"; then
  echo "🌐 Starting Vite frontend on http://localhost:3000"
  cd frontend
  # npm install --frozen-lockfile  # Uncomment this if you need to install dependencies
  npm run dev > /dev/null 2>&1 &
  FRONTEND_PID=$!
  cd ..
else
  echo "Vite frontend is already running on http://localhost:3000"
  FRONTEND_PID=$(pgrep -f "npm run dev")
fi

# ---------------------------------------------------------------------------
# 4) Wait for any of them to exit (cleanup will run on Ctrl+C)
# ---------------------------------------------------------------------------
echo "✅ All servers are up."
echo "   • Laravel: http://127.0.0.1:8000"
echo "   • Frontend: http://localhost:3000"
echo "   • Reverb: http://localhost:8080"
wait
