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
        MasterStudent::create([
            'nim' => '2310817310009',
            'full_name' => 'Muhammad Fauzan Ahsani',
            'email' => '2310817310009@ulm.ac.id'
        ]);

        MasterStudent::create([
            'nim' => '2310817310012',
            'full_name' => 'Muhammad Rizki Saputra',
            'email' => '2310817310012@ulm.ac.id'
        ]);

        MasterStudent::create([
            'nim' => '9910817119999',
            'full_name' => 'Erika Maulidiya',
            'email' => '9910817119999@ulm.ac.id'
        ]);
    }
}
