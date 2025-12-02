<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

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
            TeamSeeder::class,

            ActivitySeeder::class,
            SupervisionSeeder::class,
            LogSeeder::class
        ]);
    }
}
