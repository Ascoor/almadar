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
        $permissionNames = collect($permissionGroups)
            ->flatMap(fn ($group) => is_array($group) ? $group : [$group])
            ->unique()
            ->values();

        $permissions = $permissionNames->map(fn ($name) => Permission::create([
            'name' => $name,
            'guard_name' => $guard,
        ]));

        $roles = collect(Config::get('permissions.roles', []))
            ->mapWithKeys(function ($roleName) use ($guard) {
                return [$roleName => Role::create([
                    'name' => $roleName,
                    'guard_name' => $guard,
                ])];
            });

        $rolePermissionMap = Config::get('permissions.role_permission_map', []);
        $permissionsByName = $permissions->keyBy('name');

        foreach ($rolePermissionMap as $roleName => $permissionList) {
            $role = $roles->get($roleName);
            if (!$role) {
                continue;
            }

            $rolePermissions = collect($permissionList)
                ->map(fn ($permName) => $permissionsByName->get($permName))
                ->filter()
                ->values();

            $role->syncPermissions($rolePermissions);
        }

        $demoUsers = [
            [
                'name' => 'Demo Employee',
                'email' => 'employee@example.com',
                'role' => 'employee',
                'department' => 'الشؤون القانونية',
                'grade' => 'Associate',
                'legal_specialty' => 'عقود',
            ],
            [
                'name' => 'Demo Lawyer',
                'email' => 'lawyer@example.com',
                'role' => 'lawyer',
                'department' => 'التقاضي',
                'grade' => 'Senior Associate',
                'legal_specialty' => 'تقاضي',
            ],
            [
                'name' => 'Demo Dept Head',
                'email' => 'dept_head@example.com',
                'role' => 'dept_head',
                'department' => 'التحقيقات',
                'grade' => 'Department Head',
                'legal_specialty' => 'تحقيقات داخلية',
            ],
            [
                'name' => 'Demo Admin',
                'email' => 'admin@example.com',
                'role' => 'admin',
                'department' => 'الاستشارات',
                'grade' => 'Administrator',
                'legal_specialty' => 'إدارة النظام',
            ],
        ];

        $departmentsByName = $departments->keyBy('name');
        $gradesByName = $jobGrades->keyBy('name');
        $allPermissionModels = $permissions->values();

        foreach ($demoUsers as $userData) {
            $user = User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => Hash::make('password'),
                'password_changed' => true,
            ]);

            $role = $roles->get($userData['role']);
            if ($role) {
                $user->assignRole($role);
            }

            $permsForRole = collect($rolePermissionMap[$userData['role']] ?? [])
                ->map(fn ($permName) => $permissionsByName->get($permName))
                ->filter();

            if ($role && $permsForRole->isEmpty() && $userData['role'] === 'admin') {
                $permsForRole = $allPermissionModels;
            }

            if ($permsForRole->isNotEmpty()) {
                $user->syncPermissions($permsForRole);
            }

            StaffProfile::create([
                'user_id' => $user->id,
                'department_id' => optional($departmentsByName->get($userData['department']))->id,
                'job_grade_id' => optional($gradesByName->get($userData['grade']))->id,
                'legal_specialty' => $userData['legal_specialty'],
                'hired_at' => Carbon::now()->toDateString(),
            ]);
        }

        $departmentsByName->get('التحقيقات')?->update([
            'head_user_id' => User::where('email', 'dept_head@example.com')->value('id'),
        ]);

        $departmentsByName->get('الاستشارات')?->update([
            'head_user_id' => User::where('email', 'admin@example.com')->value('id'),
        ]);

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
