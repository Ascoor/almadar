<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class UsersRolesPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        $guard = 'api';

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $duplicatePermissions = Permission::select('name', 'guard_name', DB::raw('count(*) as aggregate'))
            ->groupBy('name', 'guard_name')
            ->having('aggregate', '>', 1)
            ->get();

        $duplicateRoles = Role::select('name', 'guard_name', DB::raw('count(*) as aggregate'))
            ->groupBy('name', 'guard_name')
            ->having('aggregate', '>', 1)
            ->get();

        if ($duplicatePermissions->isNotEmpty() || $duplicateRoles->isNotEmpty()) {
            $this->command?->warn('🚨 Duplicate roles/permissions detected. Please review before deploying.');
        }

        $modules = [
            'archive'                   => ['view', 'create', 'edit', 'delete'],
            'legaladvices'              => ['view', 'create', 'edit', 'delete'],
            'litigations'               => ['view', 'create', 'edit', 'delete'],
            'litigation-from'           => ['view', 'create', 'edit', 'delete'],
            'litigation-from-actions'   => ['view', 'create', 'edit', 'delete'],
            'litigation-against'        => ['view', 'create', 'edit', 'delete'],
            'litigation-against-actions'=> ['view', 'create', 'edit', 'delete'],
            'contracts'                 => ['view', 'create', 'edit', 'delete'],
            'investigations'            => ['view', 'create', 'edit', 'delete'],
            'investigation-actions'     => ['view', 'create', 'edit', 'delete'],
            'users'                     => ['view', 'create', 'edit', 'delete'],
            'roles'                     => ['view', 'create', 'edit', 'delete'],
            'permissions'               => ['view', 'create', 'edit', 'delete'],
            'managment-lists'           => ['view', 'create', 'edit', 'delete'],
            'reports'                   => ['view', 'create', 'edit', 'delete'],
            'profile'                   => ['view', 'edit'],
        ];

        foreach ($modules as $module => $actions) {
            foreach ($actions as $action) {
                Permission::firstOrCreate([
                    'name'       => "$action $module",
                    'guard_name' => $guard,
                ]);
            }
        }

        $canonicalRoles = [
            'admin'              => 'رئيس قسم',
            'user'               => 'موظف',
            'legal_investigator' => 'محقق قانوني',
            'lawyer'             => 'محام',
            'manager'            => 'مدير',
        ];

        $legacyRoleMapping = [
            'Admin' => 'admin',
            'Manager' => 'manager',
            'User' => 'user',
            'رئيس قسم' => 'admin',
            'مدير' => 'manager',
            'موظف' => 'user',
        ];

        foreach ($legacyRoleMapping as $legacyName => $canonical) {
            Role::where('name', $legacyName)->update(['name' => $canonical]);
        }

        $roleInstances = collect();
        foreach ($canonicalRoles as $slug => $label) {
            $roleInstances[$slug] = Role::firstOrCreate(
                ['name' => $slug, 'guard_name' => $guard],
                ['guard_name' => $guard]
            );
        }

        $allPermissions = Permission::all();

        $managerPermissions = Permission::whereIn('name', [
            'view archive', 'view legaladvices', 'view litigations',
            'view contracts', 'view investigations', 'view reports',
            'view profile', 'edit profile',
        ])->get();

        $userPermissions = Permission::whereIn('name', [
            'view legaladvices', 'view contracts', 'view profile', 'edit profile',
        ])->get();

        $investigatorPermissions = Permission::whereIn('name', [
            'view investigations', 'create investigations', 'edit investigations', 'delete investigations',
            'view investigation-actions', 'create investigation-actions', 'edit investigation-actions', 'delete investigation-actions',
            'view reports',
        ])->get();

        $lawyerPermissions = Permission::whereIn('name', [
            'view litigations', 'create litigations', 'edit litigations', 'delete litigations',
            'view litigation-from', 'create litigation-from', 'edit litigation-from', 'delete litigation-from',
            'view litigation-from-actions', 'create litigation-from-actions', 'edit litigation-from-actions', 'delete litigation-from-actions',
            'view litigation-against', 'create litigation-against', 'edit litigation-against', 'delete litigation-against',
            'view litigation-against-actions', 'create litigation-against-actions', 'edit litigation-against-actions', 'delete litigation-against-actions',
        ])->get();

        $rolePermissionMap = [
            'admin'              => $allPermissions,
            'manager'            => $managerPermissions,
            'user'               => $userPermissions,
            'legal_investigator' => $investigatorPermissions,
            'lawyer'             => $lawyerPermissions,
        ];

        foreach ($rolePermissionMap as $roleSlug => $permissions) {
            $roleInstances[$roleSlug]?->syncPermissions($permissions);
        }

        $seedUsers = [
            'admin' => [
            
                    ['name'=>'د. محمد','role' => 'admin','email'=>'mohamed@almadar.ly','image'=>'users_images/admin1.png'],
                    ['name'=>'أ. عدنان','role' => 'admin','email'=>'adnan@almadar.ly','image'=>'users_images/admin2.jpg'],
                    ['name'=>'أ. سكينة','role' => 'admin','email'=>'sakeena@almadar.ly','image'=>'users_images/admin4.png'],
                    ['name'=>'أدمن 4','role' => 'admin','email'=>'admin4@almadar.ly','image'=>'users_images/admin3.jpg'],
                    ['name'=>'أدمن 5','role' => 'admin','email'=>'admin5@almadar.ly','image'=>'users_images/admin5.jpg'],
         
              ],
            'manager' => [
                ['name' => 'Manager User 1', 'email' => 'manager1@almadar.ly'],
            ],
            'user' => [
                ['name' => 'User 1', 'email' => 'user1@almadar.ly'],
            ],
        ];

        foreach ($seedUsers as $roleSlug => $accounts) {
            foreach ($accounts as $account) {
                $user = User::updateOrCreate(
                    ['email' => $account['email']],
                    [
                        'name'             => $account['name'],
                        'password'         => Hash::make($roleSlug === 'admin' ? 'Askar@1984' : ($roleSlug === 'manager' ? 'Manager123!' : 'User123!')),
                        'password_changed' => true,
                        'image'            => $account['image'] ?? null,
                    ]
                );
                $user->syncRoles([$roleInstances[$roleSlug]->name]);
                $user->syncPermissions($rolePermissionMap[$roleSlug]);
            }
        }

        $this->command?->info(sprintf(
            'Roles: %d, Permissions: %d, Users: %d',
            Role::count(),
            Permission::count(),
            User::count()
        ));

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
