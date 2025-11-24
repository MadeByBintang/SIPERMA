<?php

namespace Database\Seeders;

use App\Models\Instantion;
use Illuminate\Database\Seeder;
use App\Models\Institution;

class InstitutionSeeder extends Seeder
{
    public function run()
    {
        $institutions = [
            [
                'name' => 'PT. Telkom Indonesia',
                'sector' => 'BUMN',
                'address' => 'Jl. Japati No. 1, Bandung',
                'owner_name' => 'Manager HRD',
                'owner_email' => 'hrd@telkom.co.id',
                'owner_phone' => '022-452155',
            ],
            [
                'name' => 'Tokopedia',
                'sector' => 'Startup',
                'address' => 'Tokopedia Tower, Jakarta',
                'owner_name' => 'William Tanuwijaya',
                'owner_email' => 'recruit@tokopedia.com',
                'owner_phone' => null,
            ],
            [
                'name' => 'Dinas Kominfo',
                'sector' => 'Dinas',
                'address' => 'Jl. Medan Merdeka Barat No. 9',
                'owner_name' => 'Kepala Dinas',
                'owner_email' => 'humas@kominfo.go.id',
                'owner_phone' => '021-345212',
            ],
            [
                'name' => 'Bank BCA',
                'sector' => 'Swasta',
                'address' => 'Menara BCA, Grand Indonesia',
                'owner_name' => 'HR Recruitment',
                'owner_email' => 'career@bca.co.id',
                'owner_phone' => null,
            ],
        ];

        foreach ($institutions as $data) {
            
            Instantion::firstOrCreate(
                ['name' => $data['name']], 
                $data 
            );
        }
    }
}