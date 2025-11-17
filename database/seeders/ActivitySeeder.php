<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Activity;
use App\Models\ActivityType;

class ActivitySeeder extends Seeder
{
    public function run(): void
    {
        Activity::create([
            'activity_type_id' => '3',
            'title' => 'Competitive Programming Compfest 17',
            'description' => 'Lomba CP di Compfest 17 Fasilkom UI',
            'start_date' => '2025-07-01',
            'end_date' => '2025-08-31',
        ]);
    }
}
