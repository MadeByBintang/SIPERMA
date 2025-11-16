<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Activity;
use App\Models\ActivityType;

class ActivitySeeder extends Seeder
{
    public function run(): void
    {
        // 1. Cari Tipe Aktivitas "MBKM"
        $mbkmType = ActivityType::where('activity_type_name', 'MBKM')->first();

        if ($mbkmType) {
            // 2. Buat Aktivitasnya
            Activity::create([
                'activity_type_id' => $mbkmType->activity_type_id,
                'title' => 'MBKM Studi Independen di PT X',
                'description' => 'Program studi independen batch 7 di PT X.',
                'start_date' => '2025-02-01',
                'end_date' => '2025-06-30',
            ]);
        }
    }
}
