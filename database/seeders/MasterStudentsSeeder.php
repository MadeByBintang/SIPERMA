<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MasterStudent; // <-- Import Model
use Illuminate\Support\Facades\DB;

class MasterStudentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // (Kita sudah hapus truncate() sebelumnya, itu sudah benar)

        // Buat data mahasiswa contoh
        MasterStudent::create([
            'nim' => '2210010001',
            'full_name' => 'Ahmad Fauzan',
            'email' => 'ahmad.fauzan@mahasiswa.kampus.ac.id' // <-- INI YANG HILANG
        ]);

        MasterStudent::create([
            'nim' => '2210010002',
            'full_name' => 'Siti Nurhaliza',
            'email' => 'siti.nurhaliza@mahasiswa.kampus.ac.id' // <-- INI YANG HILANG
        ]);
    }
}
