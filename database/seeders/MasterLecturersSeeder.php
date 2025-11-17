<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MasterLecturer; // <-- Import Model YANG BENAR
use Illuminate\Support\Facades\DB;

class MasterLecturersSeeder extends Seeder // <-- Nama Kelas YANG BENAR
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MasterLecturer::create([
            'nip' => '198503102010011001',
            'full_name' => 'Dr. Budi Santoso, M.Kom.',
            'email' => 'budi.santoso@ulm.ac.id'
        ]);

        MasterLecturer::create([
            'nip' => '199005202015032002',
            'full_name' => 'Rina Wijaya, S.T., M.T.',
            'email' => 'rina.wijaya@ulm.ac.id'
        ]);

        MasterLecturer::create([
            'nip' => '200006192025062016',
            'full_name' => 'Erika Maulidiya, S.Kom., M.Kom',
            'email' => 'erikamaulidiya@ulml.ac.id'
        ]);
    }
}
