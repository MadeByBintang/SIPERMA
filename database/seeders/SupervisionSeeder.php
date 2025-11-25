<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Supervision;
use App\Models\Lecturer;
use App\Models\MasterLecturer;
use App\Models\Team;
use App\Models\Activity;

class SupervisionSeeder extends Seeder
{
    public function run(): void
    {
        $masterLecturer = MasterLecturer::where('nip', '198503102010011001')->first();

        $team = Team::where('team_name', 'Tim MBKM PT X')->first();

        $activity = Activity::where('title', 'MBKM Studi Independen di PT X')->first();

        if ($masterLecturer && $team && $activity) {
            $lecturer = $masterLecturer->lecturer;

            if ($lecturer) {
                Supervision::create([
                    'lecturer_id' => $lecturer->lecturer_id,
                    'team_id' => $team->team_id,
                    'activity_id' => $activity->activity_id,
                    'supervision_status' => 'Aktif',
                    'assigned_date' => now(),
                ]);
            }
        }
    }
}
