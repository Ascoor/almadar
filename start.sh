#!/usr/bin/env bash
# شغّل خادم لارافيل في الخلفية
cd backend
php artisan serve --host=127.0.0.1 --port=8000 &
BACKEND_PID=$!

# ارجع للجذر ثم شغّل الفرونت إند
cd ../frontend
yarn install      # (إذا لم تنصب الحزم بعد)
yarn run dev

# عند الإقفال، أوقف خادم الباك-إند
kill $BACKEND_PID
