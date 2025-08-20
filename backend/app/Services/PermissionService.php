<?php
namespace App\Services;

use App\Events\UserPermissionsUpdated;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class PermissionService
{
    public function syncUserPermissions(User $user, array $names): void
    {
        DB::transaction(function () use ($user, $names) {
            $user->syncPermissions($names);
            $this->bump($user, ['permissions' => $names]);
        });
    }

    public function assignRoles(User $user, array $roles): void
    {
        DB::transaction(function () use ($user, $roles) {
            $user->syncRoles($roles);
            $this->bump($user, ['roles' => $roles]);
        });
    }

    public function snapshot(User $user): int
    {
        $resolved = $user->getAllPermissions()->pluck('name')->values();
        return DB::table('permission_snapshots')->insertGetId([
            'user_id'    => $user->id,
            'payload'    => json_encode($resolved),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function restore(User $user, int $snapshotId): void
    {
        $row = DB::table('permission_snapshots')
            ->where('id', $snapshotId)->where('user_id', $user->id)->first();

        $perms = json_decode($row->payload ?? '[]', true);
        $this->syncUserPermissions($user, $perms);
    }

    protected function bump(User $user, array $diff = []): void
    {
        $user->increment('permissions_version');
        broadcast(new UserPermissionsUpdated($user->id, $user->permissions_version, $diff))->toOthers();
    }
}
