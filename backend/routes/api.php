<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserRolePermissionController;
use App\Http\Controllers\ArchiveController;

use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\ContractCategoryController;
use App\Http\Controllers\InvestigationController;
use App\Http\Controllers\InvestigationActionController;
use App\Http\Controllers\LegalAdviceController;
use App\Http\Controllers\LegislationController;
use App\Http\Controllers\LitigationController;
use App\Http\Controllers\LitigationActionController;

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

// Permissions routes (محمي بالـ Login)
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    // ✅ Employees
    Route::apiResource('employees', EmployeeController::class);

    // ✅ Contracts (Local + International)
    Route::apiResource('contracts', ContractController::class);
    Route::apiResource('contract-categories', ContractCategoryController::class);
    Route::apiResource('archives', ArchiveController::class);

    // ✅ Investigations
    Route::apiResource('investigations', InvestigationController::class);

    // ✅ Legislations
    Route::apiResource('legislations', LegislationController::class);

    // ✅ Legal Advices
    Route::apiResource('legal-advices', LegalAdviceController::class);

    // ✅ Litigations
    Route::apiResource('litigations', LitigationController::class);
    Route::prefix('litigations/{litigation}/actions')->group(function () {
        Route::get('/', [LitigationActionController::class, 'index']);
        Route::post('/', [LitigationActionController::class, 'store']);
        Route::get('{action}', [LitigationActionController::class, 'show']);
        Route::put('{action}', [LitigationActionController::class, 'update']);
        Route::delete('{action}', [LitigationActionController::class, 'destroy']);
    });

    // ✅ Roles APIs
    Route::apiResource('roles', RoleController::class);
    Route::post('/roles/{roleId}/permissions', [RoleController::class, 'assignPermission']);
    Route::delete('/roles/{roleId}/permissions', [RoleController::class, 'revokePermission']);

    // ✅ Permissions APIs
    Route::apiResource('permissions', PermissionController::class);

    // ✅ User Role & Permission Management APIs
    Route::post('/users/{userId}/assign-role', [UserRolePermissionController::class, 'assignRole']);
    Route::post('/users/{userId}/remove-role', [UserRolePermissionController::class, 'removeRole']);
    Route::post('/users/{userId}/give-permission', [UserRolePermissionController::class, 'givePermission']);
    Route::post('/users/{userId}/revoke-permission', [UserRolePermissionController::class, 'revokePermission']);
    Route::get('/users/{userId}/permissions', [UserRolePermissionController::class, 'permissions']);

    // routes/api.php
    Route::prefix('investigations')->group(function () {

        // ✅ CRUD للتحقيقات
        Route::get('/', [InvestigationController::class, 'index']); // كل التحقيقات
        Route::post('/', [InvestigationController::class, 'store']); // إنشاء
        Route::get('{investigation}', [InvestigationController::class, 'show']); // عرض مفصل
        Route::put('{investigation}', [InvestigationController::class, 'update']); // تعديل
        Route::delete('{investigation}', [InvestigationController::class, 'destroy']); // حذف

        // ✅ الإجراءات الخاصة بكل تحقيق
        Route::prefix('{investigation}/actions')->group(function () {
            Route::get('/', [InvestigationActionController::class, 'index']); // قائمة الإجراءات
            Route::post('/', [InvestigationActionController::class, 'store']); // إضافة
            Route::get('{action}', [InvestigationActionController::class, 'show']); // إجراء واحد
            Route::put('{action}', [InvestigationActionController::class, 'update']); // تعديل
            Route::delete('{action}', [InvestigationActionController::class, 'destroy']); // حذف
        });
    });
});
