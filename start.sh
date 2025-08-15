#!/usr/bin/env bash
set -e

# Set the directory where the script is located
SCRIPT_DIR=$(dirname "$(realpath "$0")")
cd "$SCRIPT_DIR"

# Helper: on exit (or Ctrl+C) kill all children
cleanup() {
  echo "⏹  Stopping all servers…"
  kill "$BACKEND_PID"  2>/dev/null || true
  kill "$REVERB_PID"   2>/dev/null || true
  kill "$FRONTEND_PID" 2>/dev/null || true
  exit 0
}
trap cleanup SIGINT SIGTERM

# Start the Laravel app
echo "🚀 Starting Laravel on http://127.0.0.1:8000"
cd backend
composer i
php artisan optimize:clear
php artisan serve --host=127.0.0.1 --port=8000 > /dev/null 2>&1 &
BACKEND_PID=$!
cd ..

  # Start the reverb server
  echo "🌐 Starting reverb http://localhost:8080"
  cd backend  # Ensure you are in the correct directory
  php artisan reverb:start --debug > /dev/null 2>&1 &
  REVERB_PID=$!
  cd ..
 
# Start the front-end dev server
echo "🌐 Starting Vite frontend on http://localhost:3000"
cd frontend
npm install --frozen-lockfile
npm run dev > /dev/null 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for any of them to exit (cleanup will run on Ctrl+C)
echo "✅ All servers are up."
echo "   • Laravel: http://127.0.0.1:8000"
echo "   • Frontend: http://localhost:3000"
 echo "   • reverb: http://localhost:8080"
wait
