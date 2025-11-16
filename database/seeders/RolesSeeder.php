<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB; // <-- Import DB Facade
use App\Models\Role; // <-- Import Model Role

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {



        // Masukkan data baru
        Role::create(['role_name' => 'Admin']);
        Role::create(['role_name' => 'Dosen']);
        Role::create(['role_name' => 'Mahasiswa']);
    }
}
