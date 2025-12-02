<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\Team;
use App\Models\Activity;
use App\Models\Lecturer;
use App\Models\ActivityLog;
use App\Models\Supervision;
use App\Models\MasterLecturer;
use Illuminate\Database\Seeder;

class SupervisionSeeder extends Seeder
{
    public function run(): void
    {
        $supervisions = [
            [
                // id 1
                'student_id'            => 50,
                'lecturer_id'           => 5,
                'team_id'               => 1,
                'activity_id'           => 1,
                'supervision_status'    => 'completed',
                'assigned_at'           => '2025-06-25',
                'responded_at'          => '2025-06-30',
                'finished_at'           => '2025-08-15',
                'notes'                 => 'Bismillah bisa'
            ],
            [
                'student_id'            => 7,
                'lecturer_id'           => 3,
                'team_id'               => 2,
                'activity_id'           => 2,
                'supervision_status'    => 'completed',
                'assigned_at'           => '2025-03-11',
                'responded_at'          => '2025-03-12',
                'finished_at'           => '2025-05-13',
                'notes'                 => 'Keren'
            ],
            [
                'student_id'            => 50,
                'lecturer_id'           => 2,
                'team_id'               => 3,
                'activity_id'           => 3,
                'supervision_status'    => 'pending',
                'assigned_at'           => '2025-12-01',
                'responded_at'          => null,
                'finished_at'           => null,
                'notes'                 => null
            ],
            [
                'student_id'            => 18,
                'lecturer_id'           => 5,
                'team_id'               => 4,
                'activity_id'           => 4,
                'supervision_status'    => 'rejected',
                'assigned_at'           => '2025-09-01',
                'responded_at'          => '2025-09-02',
                'finished_at'           => null,
                'notes'                 => 'Maaf saya ada kesibukan di lain'
            ],
            [
                // id 5
                'student_id'            => 23,
                'lecturer_id'           => 8,
                'team_id'               => 5,
                'activity_id'           => 5,
                'supervision_status'    => 'pending',
                'assigned_at'           => '2025-11-29',
                'responded_at'          => null,
                'finished_at'           => null,
                'notes'                 => 'Bismillah bisa'
            ],
            [
                'student_id'            => 1,
                'lecturer_id'           => 4,
                'team_id'               => 6,
                'activity_id'           => 6,
                'supervision_status'    => 'approved',
                'assigned_at'           => '2025-11-30',
                'responded_at'          => '2025-12-01',
                'finished_at'           => null,
                'notes'                 => 'Silahkan temui saya di ruang dosen'
            ],
            [
                'student_id'            => 2,
                'lecturer_id'           => 7,
                'team_id'               => 7,
                'activity_id'           => 7,
                'supervision_status'    => 'completed',
                'assigned_at'           => '2025-06-25',
                'responded_at'          => '2025-06-30',
                'finished_at'           => '2025-10-01',
                'notes'                 => 'Semangat'
            ],
            [
                'student_id'            => 9,
                'lecturer_id'           => 3,
                'team_id'               => 8,
                'activity_id'           => 8,
                'supervision_status'    => 'completed',
                'assigned_at'           => '2025-04-09',
                'responded_at'          => '2025-04-10',
                'finished_at'           => '2025-07-17',
                'notes'                 => 'Bismillah bisa'
            ],
            [
                'student_id'            => 10,
                'lecturer_id'           => 10,
                'activity_id'           => 9,
                'team_id'               => null,
                'supervision_status'    => 'completed',
                'assigned_at'           => '2025-01-28',
                'responded_at'          => '2025-01-29',
                'finished_at'           => '2025-08-10',
                'notes'                 => 'Silahkan temui saya di ruang dosen'
            ],
            [
                // id 10
                'student_id'            => 15,
                'lecturer_id'           => 2,
                'activity_id'           => 10,
                'team_id'               => null,
                'supervision_status'    => 'completed',
                'assigned_at'           => '2024-12-25',
                'responded_at'          => '2025-12-30',
                'finished_at'           => '2025-07-10',
                'notes'                 => 'Silahkan temui saya di ruang dosen'
            ],
            [
                'student_id'            => 50,
                'lecturer_id'           => 7,
                'activity_id'           => 11,
                'team_id'               => null,
                'supervision_status'    => 'completed',
                'assigned_at'           => '2024-12-25',
                'responded_at'          => '2025-12-30',
                'finished_at'           => '2025-07-10',
                'notes'                 => 'Silahkan temui saya di ruang dosen'
            ],
            [
                'student_id'            => 49,
                'lecturer_id'           => 3,
                'activity_id'           => 12,
                'team_id'               => null,
                'supervision_status'    => 'approved',
                'assigned_at'           => '2025-06-05',
                'responded_at'          => '2025-12-15',
                'finished_at'           => null,
                'notes'                 => 'Silahkan temui saya di ruang dosen'
            ],
            [
                'student_id'            => 51,
                'lecturer_id'           => 2,
                'activity_id'           => 13,
                'team_id'               => null,
                'supervision_status'    => 'approved',
                'assigned_at'           => '2025-06-05',
                'responded_at'          => '2025-12-15',
                'finished_at'           => null,
                'notes'                 => 'Silahkan temui saya di ruang dosen'
            ],
            [
                'student_id'            => 8,
                'lecturer_id'           => 1,
                'activity_id'           => 14,
                'team_id'               => null,
                'supervision_status'    => 'rejected',
                'assigned_at'           => '2025-10-25',
                'responded_at'          => '2025-10-30',
                'finished_at'           => null,
                'notes'                 => 'Saya kurang cocok sepertinya'
            ],
            [
                // id 15
                'student_id'            => 31,
                'lecturer_id'           => 3,
                'team_id'               => 9,
                'activity_id'           => 15,
                'supervision_status'    => 'rejected',
                'assigned_at'           => '2025-10-25',
                'responded_at'          => '2025-10-30',
                'finished_at'           => null,
                'notes'                 => 'Saya kurang cocok sepertinya'
            ],
            [
                'student_id'            => 1,
                'lecturer_id'           => 2,
                'activity_id'           => 16,
                'team_id'               => null,
                'supervision_status'    => 'approved',
                'assigned_at'           => '2025-08-27',
                'responded_at'          => '2025-08-30',
                'finished_at'           => null,
                'notes'                 => 'Silahkan temui saya di ruang dosen'
            ],
            [
                'student_id'            => 25,
                'lecturer_id'           => 2,
                'activity_id'           => 17,
                'team_id'               => null,
                'supervision_status'    => 'completed',
                'assigned_at'           => '2025-06-05',
                'responded_at'          => '2025-06-09',
                'finished_at'           => '2025-07-22',
                'notes'                 => 'Silahkan temui saya di ruang dosen'
            ],
            [
                'student_id'            => 31,
                'lecturer_id'           => 10,
                'activity_id'           => 18,
                'team_id'               => 10,
                'supervision_status'    => 'completed',
                'assigned_at'           => '2025-03-25',
                'responded_at'          => '2025-03-27',
                'finished_at'           => '2025-07-02',
                'notes'                 => 'Silahkan temui saya di ruang dosen'
            ],
            [
                'student_id'            => 33,
                'lecturer_id'           => 3,
                'activity_id'           => 19,
                'team_id'               => null,
                'supervision_status'    => 'approved',
                'assigned_at'           => '2025-06-05',
                'responded_at'          => '2025-12-15',
                'finished_at'           => null,
                'notes'                 => 'Tesis macam apa ini'
            ],
        ];


        foreach($supervisions as $sv){
            Supervision::firstOrCreate($sv);
        }
    }
}
