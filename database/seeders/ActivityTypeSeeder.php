<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ActivityType;

class ActivityTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ActivityType::create(['activity_type_name' => 'Tugas Akhir']);
        ActivityType::create(['activity_type_name' => 'PKL']);
        ActivityType::create(['activity_type_name' => 'Lomba']);
        ActivityType::create(['activity_type_name' => 'Penelitian']);
    }
}
