<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MasterLecturer;

class MasterLecturersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $lecturers = [
            [
                'nip' => '198205082008011010',
                'full_name' => 'EKA SETYA WIJAYA',
                'email' => 'ekasw@ulm.ac.id'
            ],
            [
                'nip' => '198411202015042002',
                'full_name' => 'YUSLENA SARI',
                'email' => 'yuzlena@ulm.ac.id'
            ],
            [
                'nip' => '198606132015041001',
                'full_name' => 'MUHAMMAD ALKAFF',
                'email' => 'm.alkaff@ulm.ac.id'
            ],
            [
                'nip' => '198810272019032013',
                'full_name' => 'MUTI\'A MAULIDA',
                'email' => 'mutia.maulida@ulm.ac.id'
            ],
            [
                'nip' => '199307032019031011',
                'full_name' => 'ANDREYAN RIZKY BASKARA',
                'email' => 'andreyan.baskara@ulm.ac.id'
            ],
            [
                'nip' => '199110252019032018',
                'full_name' => 'NURUL FATHANAH MUSTAMIN',
                'email' => 'nurul.mustamin@ulm.ac.id'
            ],
            [
                'nip' => '199106192024062001',
                'full_name' => 'HELDA YUNITA',
                'email' => 'helda.yunita@ulm.ac.id'
            ],
            [
                'nip' => '199710312025061009',
                'full_name' => 'IRHAM MAULANI ABDUL GANI',
                'email' => 'irhammag.199710312025061009@ulm.ac.id'
            ],
            [
                'nip' => '199807102025061010',
                'full_name' => 'ACHMAD MUJADDID ISLAMI',
                'email' => 'achmadmi.199807102025061010@ulm.ac.id'
            ],
            [
                'nip' => '200006192025062016',
                'full_name' => 'ERIKA MAULIDIYA',
                'email' => 'erikam.200006192025062016@ulm.ac.id'
            ],
            [
                'nip' => '199611092023211009',
                'full_name' => 'MUHAMMAD FAJRIAN NOOR',
                'email' => 'fajrian.noor@ulm.ac.id'
            ],
            [
                'nip' => '198904162024211002',
                'full_name' => 'MUHAMMAD BAHIT',
                'email' => 'muhammadbahit@ulm.ac.id'
            ],
            [
                'nip' => '1981090420181110000',
                'full_name' => 'FADLIYANUR',
                'email' => 'fadliyanur@ulm.ac.id'
            ]
        ];

        MasterLecturer::insert($lecturers);
    }
}
