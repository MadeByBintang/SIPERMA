<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MasterLecturer;
use App\Models\MasterStudent;
use App\Models\Lecturer;
use App\Models\Student;

class FocusSeeder extends Seeder
{
    public function run(): void
    {
        $focusList = ['BIG DATA', 'MTI', 'JARINGAN'];

        // update lecturer
        MasterLecturer::all()->each(function ($master) use ($focusList) {

            $lecturer = Lecturer::where('master_lecturer_id', $master->master_lecturer_id)->first();

            if ($lecturer) {
                $lecturer->update([
                    'focus' => $focusList[array_rand($focusList)]
                ]);
            }
        });

        // update student
        MasterStudent::all()->each(function ($master) use ($focusList) {

            $student = Student::where('master_student_id', $master->master_student_id)->first();

            if ($student) {
                $student->update([
                    'focus' => $focusList[array_rand($focusList)]
                ]);
            }
        });
    }
}
