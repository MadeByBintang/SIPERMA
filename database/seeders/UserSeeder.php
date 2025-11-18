<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Lecturer;         // <-- Import Lecturer
use App\Models\Student;          // <-- Import Student
use App\Models\MasterLecturer;   // <-- Import MasterLecturer
use App\Models\MasterStudent;    // <-- Import MasterStudent
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $lecturers = MasterLecturer::all();

        foreach($lecturers as $lecturer){
            $user = User::firstOrCreate([
                'email'     => $lecturer -> email,
                'username'  => $lecturer -> nip,
                'password'  => Hash::make('password'),
                'role_id'   => 2
            ]);

            Lecturer::firstOrCreate([
                'master_lecturer_id' => $lecturer -> master_lecturer_id,
                'user_id' => $user -> user_id
            ]);
        };

        $students = MasterStudent::all();

        foreach($students as $student){
            $user = User::firstOrCreate([
                'email'     => $student -> email,
                'username'  => $student -> nim,
                'password'  => Hash::make('password'),
                'role_id'   => 3
            ]);

            Student::firstOrCreate([
                'master_student_id' => $student -> master_student_id,
                'user_id'           => $user -> user_id
            ]);
        };

        User::where('username', '9910817119999')
            ->update(['password' => Hash::make('student_king123')]);

        User::where('username', '200006192025062016')
            ->update(['password' => Hash::make('dosen_king123')]);
    }
}
