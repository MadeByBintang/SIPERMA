<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Student;          // <-- Import Student
use App\Models\Lecturer;         // <-- Import Lecturer
use App\Models\MasterStudent;    // <-- Import MasterStudent
use App\Models\MasterLecturer;   // <-- Import MasterLecturer

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        User::where('username', '9910817119999')
            ->update(['password' => Hash::make('student_king123')]);

        User::where('username', '200006192025062016')
            ->update(['password' => Hash::make('dosen_king123')]);
    }
}
