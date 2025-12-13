<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\JobGrade;
use App\Models\StaffProfile;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class SetupOrgSeeder extends Seeder
{
    public function run(): void
    {
        $guard = 'api';

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        Schema::disableForeignKeyConstraints();
        DB::table('model_has_permissions')->truncate();
        DB::table('model_has_roles')->truncate();
        DB::table('role_has_permissions')->truncate();
        DB::table('permissions')->truncate();
        DB::table('roles')->truncate();
        DB::table('staff_profiles')->truncate();
        DB::table('job_grades')->truncate();
        DB::table('departments')->truncate();
        DB::table('users')->truncate();
        Schema::enableForeignKeyConstraints();

        $departments = collect([
            ['name' => 'الشؤون القانونية', 'description' => 'إدارة العقود والمذكرات'],
            ['name' => 'التقاضي', 'description' => 'متابعة الدعاوى والطعون'],
            ['name' => 'التحقيقات', 'description' => 'التحقيقات الداخلية والتأديبية'],
            ['name' => 'الاستشارات', 'description' => 'الاستشارات القانونية السريعة'],
        ])->map(fn ($dept) => Department::create($dept));

        $jobGrades = collect([
            ['name' => 'Junior Associate', 'slug' => 'junior-associate', 'level' => 1, 'description' => 'حديث التخرج'],
            ['name' => 'Associate', 'slug' => 'associate', 'level' => 2, 'description' => 'محامٍ مساعد'],
            ['name' => 'Senior Associate', 'slug' => 'senior-associate', 'level' => 3, 'description' => 'محامٍ أول'],
            ['name' => 'Department Head', 'slug' => 'department-head', 'level' => 4, 'description' => 'رئيس قسم'],
            ['name' => 'Administrator', 'slug' => 'administrator', 'level' => 5, 'description' => 'مسؤول نظام'],
        ])->map(fn ($grade) => JobGrade::create($grade));

        $permissionGroups = Config::get('permissions.permissions', []);
        $configPermissionNames = collect($permissionGroups)
            ->flatMap(fn ($group) => is_array($group) ? $group : [$group])
            ->unique();

        $legacyModules = [
            'archive'                 => ['view', 'create', 'edit', 'delete'],
            'legaladvices'            => ['view', 'create', 'edit', 'delete'],
            'litigations'             => ['view', 'create', 'edit', 'delete'],
            'litigation-from'         => ['view', 'create', 'edit', 'delete'],
            'litigation-from-actions' => ['view', 'create', 'edit', 'delete'],
            'litigation-against'      => ['view', 'create', 'edit', 'delete'],
            'litigation-against-actions' => ['view', 'create', 'edit', 'delete'],
            'contracts'               => ['view', 'create', 'edit', 'delete'],
            'investigations'          => ['view', 'create', 'edit', 'delete'],
            'investigation-actions'   => ['view', 'create', 'edit', 'delete'],
            'users'                   => ['view', 'create', 'edit', 'delete'],
            'roles'                   => ['view', 'create', 'edit', 'delete'],
            'permissions'             => ['view', 'create', 'edit', 'delete'],
            'managment-lists'         => ['view', 'create', 'edit', 'delete'],
            'reports'                 => ['view', 'create', 'edit', 'delete'],
            'profile'                 => ['view', 'edit'],
        ];

        $legacyPermissionNames = collect($legacyModules)
            ->flatMap(function ($actions, $module) {
                return collect($actions)->map(fn ($action) => "{$action} {$module}");
            });

        $permissionNames = $configPermissionNames
            ->merge($legacyPermissionNames)
            ->unique()
            ->values();

        $permissions = $permissionNames->map(fn ($name) => Permission::firstOrCreate([
            'name' => $name,
            'guard_name' => $guard,
        ]));

        $roles = collect(Config::get('permissions.roles', []))
            ->merge(['Admin', 'Manager', 'User'])
            ->unique()
            ->mapWithKeys(function ($roleName) use ($guard) {
                return [$roleName => Role::firstOrCreate([
                    'name' => $roleName,
                    'guard_name' => $guard,
                ])];
            });

        $rolePermissionMap = Config::get('permissions.role_permission_map', []);
        $legacyRolePermissionMap = [
            'Admin' => $permissionNames->toArray(),
            'Manager' => [
                'view archive', 'view legaladvices', 'view litigations',
                'view contracts', 'view investigations', 'view reports',
                'view profile', 'edit profile',
            ],
            'User' => [
                'view legaladvices', 'view contracts', 'view profile', 'edit profile',
            ],
        ];

        $permissionsByName = $permissions->keyBy('name');

        foreach ($roles as $roleName => $role) {
            $rolePermissions = collect($rolePermissionMap[$roleName] ?? [])
                ->merge($legacyRolePermissionMap[$roleName] ?? [])
                ->map(fn ($permName) => $permissionsByName->get($permName))
                ->filter();

            if ($rolePermissions->isEmpty() && in_array($roleName, ['admin', 'Admin'], true)) {
                $rolePermissions = $permissions;
            }

            $role->syncPermissions($rolePermissions);
        }

        $demoUsers = [
            [
                'name' => 'Demo Employee',
                'email' => 'employee@example.com',
                'role' => 'employee',
                'password' => 'password',
                'department' => 'الشؤون القانونية',
                'grade' => 'Associate',
                'legal_specialty' => 'عقود',
            ],
            [
                'name' => 'Demo Lawyer',
                'email' => 'lawyer@example.com',
                'role' => 'lawyer',
                'password' => 'password',
                'department' => 'التقاضي',
                'grade' => 'Senior Associate',
                'legal_specialty' => 'تقاضي',
            ],
            [
                'name' => 'Demo Dept Head',
                'email' => 'dept_head@example.com',
                'role' => 'dept_head',
                'password' => 'password',
                'department' => 'التحقيقات',
                'grade' => 'Department Head',
                'legal_specialty' => 'تحقيقات داخلية',
            ],
            [
                'name' => 'Demo Admin',
                'email' => 'admin@example.com',
                'role' => 'admin',
                'password' => 'password',
                'department' => 'الاستشارات',
                'grade' => 'Administrator',
                'legal_specialty' => 'إدارة النظام',
            ],
        ];

        $legacyUsers = [
            ...collect([
                ['name' => 'د. محمد', 'email' => 'mohamed@almadar.ly', 'image' => 'users_images/admin1.png'],
                ['name' => 'أ. عدنان', 'email' => 'adnan@almadar.ly', 'image' => 'users_images/admin2.jpg'],
                ['name' => 'أ. سكينة', 'email' => 'sakeena@almadar.ly', 'image' => 'users_images/admin4.png'],
                ['name' => 'أدمن 4', 'email' => 'admin4@almadar.ly', 'image' => 'users_images/admin3.jpg'],
                ['name' => 'أدم 5', 'email' => 'admin5@almadar.ly', 'image' => 'users_images/admin5.jpg'],
            ])->map(fn ($user) => [
                ...$user,
                'role' => 'Admin',
                'password' => 'Askar@1984',
                'department' => 'الاستشارات',
                'grade' => 'Administrator',
                'legal_specialty' => 'إدارة النظام',
            ])->toArray(),
            ...collect([
                ['name' => 'Manager User 1', 'email' => 'manager1@almadar.ly'],
                ['name' => 'Manager User 2', 'email' => 'manager2@almadar.ly'],
            ])->map(fn ($user) => [
                ...$user,
                'role' => 'Manager',
                'password' => 'Manager123!',
                'department' => 'الشؤون القانونية',
                'grade' => 'Department Head',
                'legal_specialty' => 'إدارة القسم',
            ])->toArray(),
            ...collect([
                ['name' => 'User 1', 'email' => 'user1@almadar.ly'],
                ['name' => 'User 2', 'email' => 'user2@almadar.ly'],
            ])->map(fn ($user) => [
                ...$user,
                'role' => 'User',
                'password' => 'User123!',
                'department' => 'الشؤون القانونية',
                'grade' => 'Associate',
                'legal_specialty' => 'مهام مكتبية',
            ])->toArray(),
        ];

        $allSeedUsers = collect($demoUsers)->concat($legacyUsers);

        $departmentsByName = $departments->keyBy('name');
        $gradesByName = $jobGrades->keyBy('name');
        $allPermissionModels = $permissions->values();

        foreach ($allSeedUsers as $userData) {
            $user = User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => Hash::make($userData['password']),
                'password_changed' => true,
                'image' => $userData['image'] ?? null,
            ]);

            $role = $roles->get($userData['role']);
            if ($role) {
                $user->assignRole($role);
            }

            $permsForRole = collect($rolePermissionMap[$userData['role']] ?? [])
                ->merge($legacyRolePermissionMap[$userData['role']] ?? [])
                ->map(fn ($permName) => $permissionsByName->get($permName))
                ->filter();

            if (($role && $permsForRole->isEmpty()) || in_array($userData['role'], ['admin', 'Admin'], true)) {
                $permsForRole = $allPermissionModels;
            }

            if ($permsForRole->isNotEmpty()) {
                $user->syncPermissions($permsForRole);
            }

            StaffProfile::create([
                'user_id' => $user->id,
                'department_id' => optional($departmentsByName->get($userData['department']))->id,
                'job_grade_id' => optional($gradesByName->get($userData['grade']))->id,
                'legal_specialty' => $userData['legal_specialty'] ?? null,
                'hired_at' => Carbon::now()->toDateString(),
            ]);
        }

        $departmentsByName->get('التحقيقات')?->update([
            'head_user_id' => User::where('email', 'dept_head@example.com')->value('id'),
        ]);

        $departmentsByName->get('الاستشارات')?->update([
            'head_user_id' => User::where('email', 'admin@example.com')->value('id'),
        ]);

        $departmentsByName->get('الشؤون القانونية')?->update([
            'head_user_id' => User::where('email', 'manager1@almadar.ly')->value('id'),
        ]);

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
