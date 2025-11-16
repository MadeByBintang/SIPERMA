<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Team;
use App\Models\Student;
use App\Models\MasterStudent;
use App\Models\TeamMember;

class TeamMemberSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Cari Tim
        $team = Team::where('team_name', 'Tim MBKM PT X')->first();

        // 2. Cari Mahasiswa "Ahmad Fauzan"
        $masterStudent = MasterStudent::where('nim', '2210010001')->first();

        if ($team && $masterStudent) {
            // 3. Dapatkan data 'student_id' dari masterStudent
            $student = $masterStudent->student; // Menggunakan relasi hasOne

            if ($student) {
                // 4. Tambahkan mahasiswa ke tim
                TeamMember::create([
                    'team_id' => $team->team_id,
                    'student_id' => $student->student_id,
                    'role_in_team' => 'Anggota',
                ]);
            }
        }
    }
}
