<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ActivityType; // <-- Import Model

class ActivityTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        ActivityType::create(['activity_type_name' => 'MBKM']);
        ActivityType::create(['activity_type_name' => 'Tugas Akhir']);
        ActivityType::create(['activity_type_name' => 'PKM']);
        ActivityType::create(['activity_type_name' => 'Lomba/Kompetisi']);
        ActivityType::create(['activity_type_name' => 'Proyek Independen']);
    }
}
