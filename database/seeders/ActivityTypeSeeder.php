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
        ActivityType::create(['type_name' => 'Tugas Akhir']);
        ActivityType::create(['type_name' => 'PKL']);
        ActivityType::create(['type_name' => 'Lomba']);
        ActivityType::create(['type_name' => 'Penelitian']);
    }
}
