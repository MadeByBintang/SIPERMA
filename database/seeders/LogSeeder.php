<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $logs = [
            [
                'activity_id'   => 1,
                'log_date'      => '2025-06-30',
                'progress_note' => 'Supervision was approved',
            ],
            [
                'activity_id'   => 1,
                'log_date'      => '2025-07-01',
                'progress_note' => 'Bimbingan belajar mandiri',
            ],
            [
                'activity_id'   => 1,
                'log_date'      => '2025-07-05',
                'progress_note' => 'Mengurus administrasi pendaftaran',
            ],
            [
                'activity_id'   => 1,
                'log_date'      => '2025-07-15',
                'progress_note' => 'Push TOKI, Leetcode, dan CodeForces',
            ],
            [
                'activity_id'   => 1,
                'log_date'      => '2025-08-12',
                'progress_note' => 'H-1 lomba, drill soal',
            ],
            [
                'activity_id'   => 2,
                'log_date'      => '2025-03-12',
                'progress_note' => 'Supervision was approved',
            ],
            [
                'activity_id'   => 2,
                'log_date'      => '2025-03-20',
                'progress_note' => 'Konsultasi topik',
            ],
            [
                'activity_id'   => 2,
                'log_date'      => '2025-04-01',
                'progress_note' => 'Konsultasi bab 1, 2, 3',
            ],
            [
                'activity_id'   => 2,
                'log_date'      => '2025-04-20',
                'progress_note' => 'Konsultasi bab 4 dan 5',
            ],
            [
                'activity_id'   => 6,
                'log_date'      => '2025-11-30',
                'progress_note' => 'Supervisoin was approved',
            ],
        ];

        foreach ($logs as $log) {
            ActivityLog::firstOrCreate($log);
        }
    }
}
