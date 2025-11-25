<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ActivityType;

class ActivityTypeSeeder extends Seeder
{
    public function run(): void
    {
        ActivityType::create(['type_name' => 'Tugas Akhir']);
        ActivityType::create(['type_name' => 'PKL']);
        ActivityType::create(['type_name' => 'Lomba']);
    }
}
