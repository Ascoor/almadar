<?php

use Illuminate\Http\Request;
use App\Models\Notification;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserRolePermissionController;
use App\Http\Controllers\ArchiveController; 
use App\Http\Controllers\ContractController;
use App\Http\Controllers\ContractCategoryController;
use App\Http\Controllers\InvestigationController;
use App\Http\Controllers\InvestigationActionController;
use App\Http\Controllers\LegalAdviceController;
use App\Http\Controllers\AdviceTypeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\LitigationController;
use App\Http\Controllers\LitigationActionController;
use App\Http\Controllers\InvestigationActionTypeController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LitigationActionTypeController;
use App\Http\Controllers\AssignableUserController;
 


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/ 

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::options('/{any}', function () {
    return response()->json([], 204);
})->where('any', '.*'); 

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json([
        'user' => $request->user(),
        'roles' => $request->user()->getRoleNames(),
        'permissions' => $request->user()->getAllPermissions()->pluck('name'),
    ]);
});

// Protected routes (requires authentication)
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/assignable-users', [AssignableUserController::class, 'index']);
    
    // Contracts
    Route::apiResource('contracts', ContractController::class);
    Route::patch('contracts/{contract}/assign', [ContractController::class, 'assign']);
    Route::apiResource('contract-categories', ContractCategoryController::class);
    Route::apiResource('archives', ArchiveController::class);
    Route::apiResource('users', UserController::class);
    
    // Investigations
    Route::apiResource('investigations', InvestigationController::class);
    Route::patch('investigations/{investigation}/assign', [InvestigationController::class, 'assign']);
    // في ملف routes/api.php أو web.php حسب الحاجة
    
    Route::apiResource('investigation-action-types', InvestigationActionTypeController::class);
    Route::apiResource('litigation-action-types', LitigationActionTypeController::class); 
    
    Route::get('/dashboard/statistics', [DashboardController::class, 'statistics']);
    Route::get('/dashboard/get-recent-data', [DashboardController::class, 'getAllRecentData']);
    // Legal Advices
    Route::apiResource('legal-advices', LegalAdviceController::class);
    Route::patch('legal-advices/{legal_advice}/assign', [LegalAdviceController::class, 'assign']);
    Route::apiResource('advice-types', AdviceTypeController::class);
    Route::apiResource('litigations', LitigationController::class);
Route::post('/users/{id}/change-password', [UserController::class, 'changePassword']);
Route::post('/users/{id}/first-login-password', [UserController::class, 'firstLoginPassword']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::put('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
Route::post('/notifications/mark-all-read', function (Request $request) {
    $user = auth()->user();
    $notifications = Notification::where('user_id', $user->id)->where('read', false);
    $notifications->update(['read' => true]);

    return response()->json(['message' => 'All notifications marked as read']);
});

    // Actions for Litigations
    Route::prefix('litigations/{litigation}/actions')->group(function () {
        Route::get('/', [LitigationActionController::class, 'index']);
        Route::post('/', [LitigationActionController::class, 'store']);
        Route::get('{action}', [LitigationActionController::class, 'show']);
        Route::put('{action}', [LitigationActionController::class, 'update']);
        Route::delete('{action}', [LitigationActionController::class, 'destroy']);
    });

    // Roles APIs
    Route::apiResource('roles', RoleController::class);
    Route::post('/roles/{roleId}/permissions', [RoleController::class, 'assignPermission']);
    Route::delete('/roles/{roleId}/permissions', [RoleController::class, 'revokePermission']);

    // Permissions APIs
    Route::apiResource('permissions', PermissionController::class);

    // User Role & Permission Management APIs
Route::prefix('users/{userId}')->group(function () {
    Route::post('/assign-role', [UserRolePermissionController::class, 'assignRole']);
    Route::post('/remove-role', [UserRolePermissionController::class, 'removeRole']);  
    Route::get('/permissions', [UserRolePermissionController::class, 'permissions']);
    Route::post('/permission/change', [UserRolePermissionController::class, 'changeUserPermission']); // ✅ صح
});
 
    // Investigations actions
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
            Route::patch('{action}/assign', [InvestigationActionController::class, 'assign']);
            Route::delete('{action}', [InvestigationActionController::class, 'destroy']);
        });
   
    });
});