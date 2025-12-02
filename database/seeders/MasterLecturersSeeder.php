<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Lecturer;
use Illuminate\Support\Str;
use App\Models\MasterLecturer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class MasterLecturersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $lecturers = [
            [
                // id 1
                'nip' => '198205082008011010',
                'full_name' => 'EKA SETYA WIJAYA',
                'email' => 'ekasw@ulm.ac.id',
                'focus' => 'JARINGAN'
            ],
            [
                'nip' => '198411202015042002',
                'full_name' => 'YUSLENA SARI',
                'email' => 'yuzlena@ulm.ac.id',
                'focus' => 'BIG DATA'
            ],
            [
                'nip' => '198606132015041001',
                'full_name' => 'MUHAMMAD ALKAFF',
                'email' => 'm.alkaff@ulm.ac.id',
                'focus' => 'BIG DATA'
            ],
            [
                'nip' => '198810272019032013',
                'full_name' => 'MUTI\'A MAULIDA',
                'email' => 'mutia.maulida@ulm.ac.id',
                'focus' => 'MTI'
            ],
            [
                // id 5
                'nip' => '199307032019031011',
                'full_name' => 'ANDREYAN RIZKY BASKARA',
                'email' => 'andreyan.baskara@ulm.ac.id',
                'focus' => 'BIG DATA'
            ],
            [
                'nip' => '199110252019032018',
                'full_name' => 'NURUL FATHANAH MUSTAMIN',
                'email' => 'nurul.mustamin@ulm.ac.id',
                'focus' => 'MTI'
            ],
            [
                'nip' => '199106192024062001',
                'full_name' => 'HELDA YUNITA',
                'email' => 'helda.yunita@ulm.ac.id',
                'focus' => 'MTI'
            ],
            [
                'nip' => '199710312025061009',
                'full_name' => 'IRHAM MAULANI ABDUL GANI',
                'email' => 'irhammag.199710312025061009@ulm.ac.id',
                'focus' => 'BIG DATA'
            ],
            [
                'nip' => '199807102025061010',
                'full_name' => 'ACHMAD MUJADDID ISLAMI',
                'email' => 'achmadmi.199807102025061010@ulm.ac.id',
                'focus' => 'JARINGAN'
            ],
            [
                // id 10
                'nip' => '200006192025062016',
                'full_name' => 'ERIKA MAULIDIYA',
                'email' => 'erikam.200006192025062016@ulm.ac.id',
                'focus' => 'BIG DATA'
            ],
            [
                'nip' => '199611092023211009',
                'full_name' => 'MUHAMMAD FAJRIAN NOOR',
                'email' => 'fajrian.noor@ulm.ac.id',
                'focus' => 'JARINGAN'
            ],
            [
                'nip' => '198904162024211002',
                'full_name' => 'MUHAMMAD BAHIT',
                'email' => 'muhammadbahit@ulm.ac.id',
                'focus' => 'JARINGAN'
            ],
            [
                'nip' => '1981090420181110000',
                'full_name' => 'FADLIYANUR',
                'email' => 'fadliyanur@ulm.ac.id',
                'focus' => 'MTI'
            ]
        ];

        foreach($lecturers as $lecturer){
            $lct = MasterLecturer::firstOrCreate([
                'full_name'             => Str::title(strtolower($lecturer['full_name'])),
                'nip'                   => $lecturer['nip'],
                'email'                 => strtolower($lecturer['email']),
                'is_active'             => true,
            ]);

            $user = User::firstOrCreate([
                'username'              => $lecturer['nip'],
                'password'              => Hash::make('password'),
                'role_id'               => 2
            ]);

            Lecturer::firstOrCreate([
                'master_lecturer_id' => $lct -> master_lecturer_id,
                'user_id' => $user -> user_id,
                'focus'                 => $lecturer['focus'],
                'supervision_quota'     => 8,
            ]);
        };
    }
}
