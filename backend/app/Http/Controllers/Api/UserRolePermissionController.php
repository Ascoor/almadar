<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\PermissionService;
use Illuminate\Http\Request;

class UserRolePermissionController extends Controller
{
    public function __construct(private PermissionService $svc) {}

    public function syncPermissions(Request $r, User $user){
        $data = $r->validate(['permissions'=>'array']);
        $this->svc->syncUserPermissions($user, $data['permissions'] ?? []);
        return response()->json(['ok'=>true]);
    }
    public function syncRoles(Request $r, User $user){
        $data = $r->validate(['roles'=>'array']);
        $this->svc->assignRoles($user, $data['roles'] ?? []);
        return response()->json(['ok'=>true]);
    }
    public function snapshot(User $user){
        return response()->json(['snapshot_id'=>$this->svc->snapshot($user)]);
    }
    public function restore(User $user, int $snapshot){
        $this->svc->restore($user, $snapshot);
        return response()->json(['ok'=>true]);
    }
}
