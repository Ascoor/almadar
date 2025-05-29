<?php
use Illuminate\Support\Facades\Broadcast;

use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;
use App\Events\TestEvent;
use Illuminate\Support\Facades\Route;  
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Broadcast::routes(['middleware' => ['auth:api']]);  
Route::get('/', function () {
    return view('welcome');
});


Route::get('/open-pdf/{path}', function ($path) {
    $path = str_replace('..', '', $path); // حماية

    $fullPath = storage_path("app/public/" . $path);

    if (!file_exists($fullPath)) {
        abort(404, 'الملف غير موجود');
    }

    return response()->file($fullPath, [
        'Access-Control-Allow-Origin' => '*', // 💡 هذه التي تحل المشكلة
        'Content-Type' => 'application/pdf',
    ]);
})->where('path', '.*');
