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
        $lecturers = MasterLecturer::all();

        foreach($lecturers as $lecturer){
            $user = User::firstOrCreate([
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
                'username'  => $student -> nim,
                'password'  => Hash::make('password'),
                'role_id'   => 3
            ]);

            Student::firstOrCreate([
                'master_student_id' => $student -> master_student_id,
                'user_id'           => $user -> user_id
            ]);
        };

        $admin_accounts = [
            ['0012345678', 'admin_king123'],
            ['admin', 'admin']
        ];

        foreach ($admin_accounts as $i => $acc) {
            $i++;
            $user = User::firstOrCreate(
                ['username' => $acc[0]],
                [
                    'password' => Hash::make($acc[1]),
                    'role_id'  => 1
                ]
            );

            Admin::where('admin_id', $i)
                ->update([
                    'user_id' => $user -> user_id
                ]);
        }

        User::where('username', '9910817119999')
            ->update(['password' => Hash::make('student_king123')]);

        User::where('username', '200006192025062016')
            ->update(['password' => Hash::make('dosen_king123')]);
    }
}
