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
        
        $team = Team::where('team_name', 'Tim MBKM PT X')->first();

       
        $masterStudent = MasterStudent::where('nim', '2210010001')->first();

        if ($team && $masterStudent) {
            
            $student = $masterStudent->student; 

            if ($student) {
              
                TeamMember::create([
                    'team_id' => $team->team_id,
                    'student_id' => $student->student_id,
                    'role_in_team' => 'Anggota',
                ]);
            }
        }
    }
}
