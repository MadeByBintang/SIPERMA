<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder; // Pastikan ini ada

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            
            RolesSeeder::class,
            MasterLecturersSeeder::class,
            MasterStudentsSeeder::class,
            ActivityTypeSeeder::class,
            AdminSeeder::class,
            InternshipSeeder::class,

            UserSeeder::class,
            FocusSeeder::class,

           
            ActivitiesSeeder::class,     // <-- TAMBAHKAN INI
            TeamSeeder::class,         // <-- TAMBAHKAN INI
            TeamMemberSeeder::class,   // <-- TAMBAHKAN INI
            SupervisionSeeder::class,  // <-- TAMBAHKAN INI
        ]);
    }
}
