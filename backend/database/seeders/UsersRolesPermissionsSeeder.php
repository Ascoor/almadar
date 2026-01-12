<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Artisan;
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

        /**
         * ✅ Modules & actions
         * - NOTE: fixed typo: managment-lists -> management-lists
         */
        $modules = [
            'dashboard'                  => ['view'],
            'contracts'                  => ['view', 'create', 'edit', 'delete', 'listen'],
            'contract-categories'        => ['view', 'create', 'edit', 'delete'],
            'archives'                   => ['view', 'create', 'edit', 'delete', 'listen'],
            'legal-advices'              => ['view', 'create', 'edit', 'delete', 'listen'],
            'advice-types'               => ['view', 'create', 'edit', 'delete'],
            'investigations'             => ['view', 'create', 'edit', 'delete', 'listen'],
            'investigation-actions'      => ['view', 'create', 'edit', 'delete', 'listen'],
            'investigation-action-types' => ['view', 'create', 'edit', 'delete'],
            'litigations'                => ['view', 'create', 'edit', 'delete', 'listen'],
            'litigation-actions'         => ['view', 'create', 'edit', 'delete', 'listen'],
            'litigation-action-types'    => ['view', 'create', 'edit', 'delete'],
            'users'                      => ['view', 'create', 'edit', 'delete'],
            'roles'                      => ['view', 'create', 'edit', 'delete'],
            'permissions'                => ['view', 'create', 'edit', 'delete'],
            'management-lists'           => ['view', 'create', 'edit', 'delete'],
            'profile'                    => ['view', 'edit'],
        ];

        foreach ($modules as $module => $actions) {
            foreach ($actions as $action) {
                Permission::firstOrCreate([
                    'name'       => "$action $module",
                    'guard_name' => $guard,
                ]);
            }
        }

        /**
         * ✅ Canonical roles (keys used in DB and frontend)
         * - Keep "user" as Contracts Employee (موظف عقود) for backward compatibility.
         */
        $canonicalRoles = [
            'admin'              => 'رئيس قسم',
            'manager'            => 'مدير قسم',
            'moderator'          => 'مشرف قسم',
            'user'               => 'موظف عقود',
            'legal_investigator' => 'محقق',
            'lawyer'             => 'محامي',
            'contracting_officer'=> 'موظف تعاقدات',
        ];

        /**
         * ✅ Legacy role mapping (old names -> canonical slug)
         * This prevents breaking existing DB roles (English/Arabic/old keys).
         */
        $legacyRoleMapping = [
            // English legacy
            'Admin' => 'admin',
            'Manager' => 'manager',
            'Moderator' => 'moderator',
            'User' => 'user',
            'Lawyer' => 'lawyer',
            'Legal Investigator' => 'legal_investigator',
            'Contracting Officer' => 'contracting_officer',

            // Arabic legacy
            'رئيس قسم' => 'admin',
            'مدير' => 'manager',
            'مدير قسم' => 'manager',
            'مشرف' => 'moderator',
            'مشرف قسم' => 'moderator',
            'موظف' => 'user',
            'موظف عقود' => 'user',
            'محقق قانوني' => 'legal_investigator',
            'محقق' => 'legal_investigator',
            'محام' => 'lawyer',
            'محامي' => 'lawyer',
            'موظف تعاقدات' => 'contracting_officer',

            // Old module typo roles (if any)
            'contracting' => 'contracting_officer',
        ];

        foreach ($legacyRoleMapping as $legacyName => $canonical) {
            Role::where('name', $legacyName)->update(['name' => $canonical]);
        }

        /**
         * ✅ Create roles
         */
        $roleInstances = collect();
        foreach ($canonicalRoles as $slug => $label) {
            $roleInstances[$slug] = Role::firstOrCreate(
                ['name' => $slug, 'guard_name' => $guard],
                ['guard_name' => $guard]
            );
        }

        $allPermissions = Permission::all();

        /**
         * ✅ Permissions sets by role
         */

        $moderatorPermissions = Permission::whereIn('name', [
            'view dashboard',

            'view contracts', 'create contracts', 'edit contracts',
            'view investigations', 'create investigations', 'edit investigations',
            'view litigations', 'create litigations', 'edit litigations',
            'view legal-advices', 'create legal-advices', 'edit legal-advices',
            'view archives', 'create archives', 'edit archives',

            // listen
            'listen archives', 'listen legal-advices', 'listen litigations', 'listen contracts', 'listen investigations',
        ])->get();

        $managerPermissions = Permission::whereIn('name', [
            'view dashboard',

            'view contracts', 'create contracts', 'edit contracts',
            'view contract-categories',

            'view legal-advices', 'create legal-advices', 'edit legal-advices',
            'view advice-types',

            'view investigations', 'create investigations', 'edit investigations',
            'view litigations', 'create litigations', 'edit litigations',

            'view archives',
            'view management-lists',
            'view profile', 'edit profile',

            // listen
            'listen archives', 'listen legal-advices', 'listen litigations', 'listen contracts',
            'listen investigations', 'listen investigation-actions', 'listen litigation-actions',
        ])->get();

        /**
         * user = موظف عقود
         */
        $userPermissions = Permission::whereIn('name', [
            'view dashboard',
            'view profile', 'edit profile',

            'view contracts', 'create contracts',
            'view archives',

            // listen
            'listen contracts', 'listen archives',
        ])->get();

        /**
         * contracting_officer = موظف تعاقدات
         * (هنا نفس user تقريباً، تقدر توسعها لاحقاً)
         */
        $contractingOfficerPermissions = Permission::whereIn('name', [
            'view dashboard',
            'view profile', 'edit profile',

            'view contracts', 'create contracts', 'edit contracts',
            'view archives',

            // listen
            'listen contracts', 'listen archives',
        ])->get();

        $investigatorPermissions = Permission::whereIn('name', [
            'view investigations', 'create investigations', 'edit investigations', 'delete investigations',
            'view investigation-actions', 'create investigation-actions', 'edit investigation-actions', 'delete investigation-actions',
            'view investigation-action-types',

            // listen
            'listen investigations', 'listen investigation-actions',
        ])->get();

        $lawyerPermissions = Permission::whereIn('name', [
            'view litigations', 'create litigations', 'edit litigations', 'delete litigations',
            'view litigation-actions', 'create litigation-actions', 'edit litigation-actions', 'delete litigation-actions',
            'view litigation-action-types',

            // listen
            'listen litigations', 'listen litigation-actions',
        ])->get();

        $rolePermissionMap = [
            'admin'              => $allPermissions,
            'moderator'          => $moderatorPermissions,
            'manager'            => $managerPermissions,
            'user'               => $userPermissions,
            'legal_investigator' => $investigatorPermissions,
            'lawyer'             => $lawyerPermissions,
            'contracting_officer'=> $contractingOfficerPermissions,
        ];

        foreach ($rolePermissionMap as $roleSlug => $permissions) {
            $roleInstances[$roleSlug]?->syncPermissions($permissions);
        }

        /**
         * ✅ Seed users
         */
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
            'moderator' => [
                ['name' => 'Moderator User 1', 'email' => 'moderator1@almadar.ly'],
            ],
            'user' => [
                ['name' => 'Contracts User 1', 'email' => 'user1@almadar.ly'],
            ],
            'contracting_officer' => [
                ['name' => 'Contracting Officer 1', 'email' => 'contracting1@almadar.ly'],
            ],
            'legal_investigator' => [
                ['name' => 'Investigator 1', 'email' => 'investigator1@almadar.ly'],
            ],
            'lawyer' => [
                ['name' => 'Lawyer 1', 'email' => 'lawyer1@almadar.ly'],
            ],
        ];

        $passwordMap = [
            'admin'               => 'Askar@1984',
            'manager'             => 'Manager123!',
            'moderator'           => 'Moderator123!',
            'user'                => 'User123!',
            'contracting_officer' => 'Contracting123!',
            'legal_investigator'  => 'Investigator123!',
            'lawyer'              => 'Lawyer123!',
        ];

        foreach ($seedUsers as $roleSlug => $accounts) {
            foreach ($accounts as $account) {
                $user = User::updateOrCreate(
                    ['email' => $account['email']],
                    [
                        'name'             => $account['name'],
                        'password'         => Hash::make($passwordMap[$roleSlug] ?? 'User123!'),
                        'password_changed' => true,
                        'image'            => $account['image'] ?? null,
                    ]
                );

                // Assign canonical role
                $user->syncRoles([$roleInstances[$roleSlug]->name]);
            }
        }

        $this->command?->info(sprintf(
            'Roles: %d, Permissions: %d, Users: %d',
            Role::count(),
            Permission::count(),
            User::count()
        ));

        app(PermissionRegistrar::class)->forgetCachedPermissions();
        Artisan::call('optimize:clear');
    }
}
