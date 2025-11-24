<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AcademicTitle;

class AcademicTitleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $titles = [
            // --- GELAR DEPAN (PREFIX) ---
            ['name' => 'Prof.', 'type' => 'front'],
            ['name' => 'Dr.', 'type' => 'front'],
            ['name' => 'Ir.', 'type' => 'front'],
            ['name' => 'Drs.', 'type' => 'front'],
            ['name' => 'Dra.', 'type' => 'front'],
            
            // --- GELAR BELAKANG (SUFFIX) ---
            ['name' => 'S.Kom', 'type' => 'back'],
            ['name' => 'M.Kom', 'type' => 'back'],
            ['name' => 'S.T.', 'type' => 'back'],
            ['name' => 'M.T.', 'type' => 'back'],
            ['name' => 'S.Si.', 'type' => 'back'],
            ['name' => 'M.Si.', 'type' => 'back'],
            ['name' => 'Ph.D', 'type' => 'back'],
            ['name' => 'M.Sc', 'type' => 'back'],
            ['name' => 'B.Sc', 'type' => 'back'],
            ['name' => 'M.Eng', 'type' => 'back'],
            ['name' => 'S.Pd.', 'type' => 'back'],
            ['name' => 'M.Pd.', 'type' => 'back'],
        ];

        foreach ($titles as $title) {
            // Gunakan firstOrCreate agar tidak error/duplikat jika seeder dijalankan 2x
            AcademicTitle::firstOrCreate(
                ['name' => $title['name']], // Cek apakah nama gelar sudah ada?
                ['type' => $title['type']]  // Jika belum, simpan tipe-nya
            );
        }
    }
}