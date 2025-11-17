<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;


class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::firstOrCreate([
            'email' => 'admin1@siperma.com',
            'username' => '0012345678',
            'password' => Hash::make('admin_king123'),
            'role_id' => 1,
        ]);

        User::firstOrCreate([
            'email' => 'admin2@siperma.com',
            'username' => 'admin',
            'password' => Hash::make('password'),
            'role_id' => 1,
        ]);
    }
}
