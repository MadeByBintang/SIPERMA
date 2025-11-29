<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ActivityType;

class ActivityTypeSeeder extends Seeder
{
    public function run(): void
    {
        ActivityType::create(['type_name' => 'Thesis']);
        ActivityType::create(['type_name' => 'Internship']);
        ActivityType::create(['type_name' => 'Competition']);
    }
}
