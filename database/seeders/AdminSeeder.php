<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;


class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admins = [
            [
                'name'      => 'Erika Maulidiya',
                'email'     => 'admin.luar.biasa@siperma.com',
                'username'  => '0012345678',
                'password'  => 'admin_king123'
            ],
            [
                'name'      => 'Siti Ratna Dwinta Sari',
                'email'     => 'admin.biasa.aja@siperma.com',
                'username'  => 'admin',
                'password'  => 'admin123'
            ]

            ];

        foreach ($admins as $admin){

            $u = User::firstOrCreate([
                'username'              => $admin['username'],
                'password'              => Hash::make($admin['password']),
                'role_id'               => 1
            ]);

            Admin::firstOrCreate([
                'user_id'               => $u -> user_id,
                'full_name'             => $admin['name'],
                'email'                 => $admin['email'],
            ]);
        }
    }
}
