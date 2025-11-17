<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Role;

class RolesSeeder extends Seeder
{
    public function run(): void
    {
        Role::create(['role_name' => 'admin']);
        Role::create(['role_name' => 'dosen']);
        Role::create(['role_name' => 'mahasiswa']);
    }
}
