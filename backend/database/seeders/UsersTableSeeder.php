<?php 

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        $adminRole = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'api']);

        // Super Admin
        $superAdmin = User::create([
            'name' => 'د. محمد',
            'email' => 'mohamed@almadar.ly',
            'password' => Hash::make('Askar@1984'),
            'password_changed' => true,
                'image' => 'users_images/admin1.png',
        ]);
        $superAdmin->assignRole($adminRole);
        $superAdmin->syncPermissions(Permission::all());

        // صلاحيات المستخدمين التي لا تمنح لباقي المشرفين
        $userManagementPermissions = Permission::whereIn('name', [
            'view users', 'create users', 'edit users', 'delete users',
            'view roles', 'create roles', 'edit roles', 'delete roles',
            'view permissions', 'create permissions', 'edit permissions', 'delete permissions',
        ])->pluck('name')->toArray();

        // باقي المشرفين
        $otherAdmins = [
            ['image'=> 'users_images/admin2.jpg','name' => 'أ. عدنان', 'email' => 'adnan@almadar.ly'],
            ['image'=> 'users_images/admin4.png','name' => 'أ. سكينة', 'email' => 'sakeena@almadar.ly'],
            ['image'=> 'users_images/admin3.jpg','name' => 'أدمن 4', 'email' => 'admin4@almadar.ly'],
            ['image'=> 'users_images/admin5.jpg','name' => 'أدمن 5', 'email' => 'admin5@almadar.ly'],
        ];

        foreach ($otherAdmins as $adminData) {
            $admin = User::create([
                'name' => $adminData['name'],
                'email' => $adminData['email'],
                'image' => $adminData['image'],
                'password' => Hash::make('Askar@1984'),
                'password_changed' => true,
                
            ]);
            $admin->assignRole($adminRole);

            $permissions = Permission::whereNotIn('name', $userManagementPermissions)->get();
            $admin->syncPermissions($permissions);
        }
    }
}
