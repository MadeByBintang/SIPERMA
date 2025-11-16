<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
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
        // 1. Ambil Role ID
        $adminRole = Role::where('role_name', 'Admin')->firstOrFail();
        $dosenRole = Role::where('role_name', 'Dosen')->firstOrFail();
        $mahasiswaRole = Role::where('role_name', 'Mahasiswa')->firstOrFail();

        // 2. Buat User Admin (seperti sebelumnya)
        User::updateOrCreate(
            ['email' => 'admin@siperma.com'],
            [
                'username' => 'admin',
                'password' => Hash::make('password'), // Ganti 'password' nanti
                'role_id' => $adminRole->role_id,
            ]
        );

        // 3. Buat User Dosen & Hubungkan
        // Ambil data biodata dosen pertama
        $masterDosen = MasterLecturer::where('nip', '198503102010011001')->first();
        if ($masterDosen) {
            // Buat akun user untuk dosen ini
            $userDosen = User::updateOrCreate(
                ['email' => $masterDosen->email], // Pakai email dari master data
                [
                    'username' => $masterDosen->nip, // Pakai NIP sebagai username
                    'password' => Hash::make('password'),
                    'role_id' => $dosenRole->role_id,
                ]
            );

            // Hubungkan di tabel 'lecturers'
            Lecturer::updateOrCreate(
                ['master_lecturer_id' => $masterDosen->master_lecturer_id],
                ['user_id' => $userDosen->user_id]
            );
        }

        // 4. Buat User Mahasiswa & Hubungkan
        // Ambil data biodata mahasiswa pertama
        $masterMahasiswa = MasterStudent::where('nim', '2210010001')->first();
        if ($masterMahasiswa) {
            // Buat akun user untuk mahasiswa ini
            $userMahasiswa = User::updateOrCreate(
                ['email' => $masterMahasiswa->email], // Pakai email dari master data
                [
                    'username' => $masterMahasiswa->nim, // Pakai NIM sebagai username
                    'password' => Hash::make('password'),
                    'role_id' => $mahasiswaRole->role_id,
                ]
            );

            // Hubungkan di tabel 'students'
            Student::updateOrCreate(
                ['master_student_id' => $masterMahasiswa->master_student_id],
                ['user_id' => $userMahasiswa->user_id]
            );
        }
    }
}
