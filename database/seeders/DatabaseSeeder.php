<?php

namespace Database\Seeders;

use App\Models\Instantion;
use Illuminate\Database\Seeder; // Pastikan ini ada

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            // 1. Data Master Utama
            RolesSeeder::class,
            SkillSeeder::class,
            MasterLecturersSeeder::class,
            MasterStudentsSeeder::class,
            ActivityTypeSeeder::class,
            AdminSeeder::class,
            Instantion::class,

            // 2. Akun User (yang menghubungkan data)
            UserSeeder::class,

            // 3. Data Alur Kerja (Workflow)
            ActivitySeeder::class,     // <-- TAMBAHKAN INI
            TeamSeeder::class,         // <-- TAMBAHKAN INI
            TeamMemberSeeder::class,   // <-- TAMBAHKAN INI
            SupervisionSeeder::class,  // <-- TAMBAHKAN INI
        ]);
    }
}
