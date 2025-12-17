<?php

use App\Http\Controllers\Api\AssignmentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\NotificationController as ApiNotificationController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\UserRolePermissionController;
use App\Http\Controllers\AdviceTypeController;
use App\Http\Controllers\ArchiveController;
use App\Http\Controllers\ContractCategoryController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InvestigationActionController;
use App\Http\Controllers\InvestigationActionTypeController;
use App\Http\Controllers\InvestigationController;
use App\Http\Controllers\LegalAdviceController;
use App\Http\Controllers\LitigationActionController;
use App\Http\Controllers\LitigationActionTypeController;
use App\Http\Controllers\LitigationController;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::options('/{any}', function () {
    return response()->json([], 204);
})->where('any', '.*');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('contracts', ContractController::class);
    Route::apiResource('contract-categories', ContractCategoryController::class);
    Route::apiResource('archives', ArchiveController::class);
    Route::apiResource('users', UserController::class);

    Route::apiResource('investigations', InvestigationController::class);
    Route::apiResource('investigation-action-types', InvestigationActionTypeController::class);
    Route::apiResource('litigation-action-types', LitigationActionTypeController::class);

    Route::get('/dashboard/statistics', [DashboardController::class, 'statistics']);
    Route::get('/dashboard/get-recent-data', [DashboardController::class, 'getAllRecentData']);
    Route::apiResource('legal-advices', LegalAdviceController::class);
    Route::apiResource('advice-types', AdviceTypeController::class);
    Route::apiResource('litigations', LitigationController::class);
    Route::post('/users/{id}/change-password', [UserController::class, 'changePassword']);
    Route::post('/users/{id}/first-login-password', [UserController::class, 'firstLoginPassword']);

    Route::get('/notifications', [ApiNotificationController::class, 'index']);
    Route::put('/notifications/{id}/read', [ApiNotificationController::class, 'markAsRead']);
    Route::post('/notifications/mark-all-read', [ApiNotificationController::class, 'markAllAsRead']);

    Route::prefix('litigations/{litigation}/actions')->group(function () {
        Route::get('/', [LitigationActionController::class, 'index']);
        Route::post('/', [LitigationActionController::class, 'store']);
        Route::get('{action}', [LitigationActionController::class, 'show']);
        Route::put('{action}', [LitigationActionController::class, 'update']);
        Route::delete('{action}', [LitigationActionController::class, 'destroy']);
    });

    Route::apiResource('roles', RoleController::class);
    Route::post('/roles/{roleId}/permissions', [RoleController::class, 'assignPermission']);
    Route::delete('/roles/{roleId}/permissions', [RoleController::class, 'revokePermission']);

    Route::apiResource('permissions', PermissionController::class);

    Route::prefix('users/{userId}')->group(function () {
        Route::post('/assign-role', [UserRolePermissionController::class, 'assignRole']);
        Route::post('/remove-role', [UserRolePermissionController::class, 'removeRole']);
        Route::get('/permissions', [UserRolePermissionController::class, 'permissions']);
        Route::post('/permission/change', [UserRolePermissionController::class, 'changeUserPermission']);
    });

    Route::prefix('investigations')->group(function () {
        Route::get('/', [InvestigationController::class, 'index']);
        Route::post('/', [InvestigationController::class, 'store']);
        Route::get('{investigation}', [InvestigationController::class, 'show']);
        Route::put('{investigation}', [InvestigationController::class, 'update']);
        Route::delete('{investigation}', [InvestigationController::class, 'destroy']);

        Route::prefix('{investigation}/actions')->group(function () {
            Route::get('/', [InvestigationActionController::class, 'index']);
            Route::post('/', [InvestigationActionController::class, 'store']);
            Route::get('{action}', [InvestigationActionController::class, 'show']);
            Route::put('{action}', [InvestigationActionController::class, 'update']);
            Route::delete('{action}', [InvestigationActionController::class, 'destroy']);
        });
    });

    Route::apiResource('services', ServiceController::class);
    Route::apiResource('orders', OrderController::class);
    Route::apiResource('assignments', AssignmentController::class);
    Route::get('locations/cities', [LocationController::class, 'cities']);
    Route::get('locations/cities/{city}/areas', [LocationController::class, 'areas']);
    Route::get('locations/areas', [LocationController::class, 'allAreas']);
});
