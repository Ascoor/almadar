#!/usr/bin/env bash
set -e

# -----------------------------------------------------------------------------
# Helper: on exit (or Ctrl+C) kill all children
# -----------------------------------------------------------------------------
cleanup() {
  echo "⏹  Stopping all servers…"
  kill "$BACKEND_PID"  2>/dev/null || true
  kill "$REVERB_PID"   2>/dev/null || true
  kill "$FRONTEND_PID" 2>/dev/null || true
  exit 0
}
trap cleanup SIGINT SIGTERM

# -----------------------------------------------------------------------------
# 1) Start the Laravel app
# -----------------------------------------------------------------------------
echo "🚀 Starting Laravel on http://127.0.0.1:8000"
cd backend
php artisan serve --host=127.0.0.1 --port=8000 > /dev/null 2>&1 &
BACKEND_PID=$!
cd ..
 
# -----------------------------------------------------------------------------
# 3) Start the front-end dev server
# -----------------------------------------------------------------------------
echo "🌐 Starting Vite frontend on http://localhost:3000"
cd frontend
yarn install --frozen-lockfile
yarn run dev > /dev/null 2>&1 &
FRONTEND_PID=$!
cd ..

# -----------------------------------------------------------------------------
# 4) Wait for any of them to exit (cleanup will run on Ctrl+C)
# -----------------------------------------------------------------------------
echo "✅ All servers are up."
echo "   • Laravel: http://127.0.0.1:8000" 
echo "   • Frontend: http://localhost:3000"
wait
