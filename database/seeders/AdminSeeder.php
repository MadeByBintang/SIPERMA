<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;


class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Admin::firstOrCreate([
            'full_name' => 'Erika Maulidiya',
            'email'     => 'admin.luar.biasa@siperma.com',

        ]);

        Admin::firstOrCreate([
            'full_name' => 'Siti Ratna Dwinta Sari',
            'email'     => 'admin.biasa.aja@siperma.com'
        ]);

        
    }
}
