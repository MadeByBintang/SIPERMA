<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Team;
use App\Models\Activity;

class TeamSeeder extends Seeder
{
    public function run(): void
    {
       
        $activity = Activity::where('title', 'MBKM Studi Independen di PT X')->first();

        if ($activity) {
            
            Team::create([
                'team_name' => 'Tim MBKM PT X',
                'activity_id' => $activity->activity_id,
                'description' => 'Tim untuk program studi independen di PT X',
            ]);
        }
    }
}
