<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\Lecturer;
use App\Models\MasterLecturer;
use App\Models\MasterStudent;
use Illuminate\Database\Seeder;

class FocusSeeder extends Seeder
{
    public function run(): void
    {
        $data_lecturer = [
            '198503102010011001' => 'BIG DATA',
            '199005202015032002' => 'MTI',
            '200006192025062016' => 'JARINGAN',
        ];

        $data_student = [
            '2310817310009' => 'BIG DATA',
            '2310817310012' => 'MTI',
            '9910817119999' => 'JARINGAN',
        ];

        foreach ($data_student as $nim => $focus) {
            $master = MasterStudent::where('nim', $nim)->first();
            $student = Student::where('master_student_id', $master->master_student_id)->first();
            $student->update(['focus' => $focus]);
        }

        foreach ($data_lecturer as $nip => $focus) {
            $master = MasterLecturer::where('nip', $nip)->first();
            $lecturer = Lecturer::where('master_lecturer_id', $master->master_lecturer_id)->first();
            $lecturer->update(['focus' => $focus]);
        }
    }
}
