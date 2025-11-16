<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Team;
use App\Models\Activity;

class TeamSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Cari Aktivitas yang baru dibuat
        $activity = Activity::where('title', 'MBKM Studi Independen di PT X')->first();

        if ($activity) {
            // 2. Buat Tim untuk aktivitas tsb
            Team::create([
                'team_name' => 'Tim MBKM PT X',
                'activity_id' => $activity->activity_id,
                'description' => 'Tim untuk program studi independen di PT X',
            ]);
        }
    }
}
