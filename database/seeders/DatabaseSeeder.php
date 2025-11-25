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
            FocusSeeder::class,

           
            ActivitySeeder::class,    
            TeamSeeder::class,        
            TeamMemberSeeder::class,   
            SupervisionSeeder::class,  
        ]);
    }
}
