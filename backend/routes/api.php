<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserRolePermissionController;

Route::prefix('auth')->group(function(){
  Route::post('login', [AuthController::class,'login']);
  Route::middleware('auth:api')->group(function(){
    Route::get('me', [AuthController::class,'me']);
    Route::post('logout', [AuthController::class,'logout']);
  });
});

Route::middleware('auth:api')->group(function(){
  Route::get('/me/permissions', fn() => response()->json([
    'permissions'=>auth()->user()->getAllPermissions()->pluck('name'),
    'version'=>auth()->user()->permissions_version,
  ]));

  Route::middleware('can:perm,manage permissions')->group(function(){
    Route::put('/users/{user}/permissions', [UserRolePermissionController::class,'syncPermissions']);
    Route::put('/users/{user}/roles',       [UserRolePermissionController::class,'syncRoles']);
    Route::post('/permissions/snapshot/{user}',          [UserRolePermissionController::class,'snapshot']);
    Route::post('/permissions/restore/{user}/{snapshot}',[UserRolePermissionController::class,'restore']);
  });
});
