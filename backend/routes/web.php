<?php
use Illuminate\Support\Facades\Broadcast;

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

Route::get('/test-event', function () {
    // إرسال الحدث مع رسالة اختبار
    event(new TestEvent("This is a test message from the backend!"));
    return "Test event broadcasted!";
});
