<?php

namespace Database\Seeders;

use App\Models\Internship;
use Illuminate\Database\Seeder;

class InternshipSeeder extends Seeder
{
    public function run()
    {
        $institutions = [
            // BUMN/BUMD
            [
                'name' => 'PT. Telkom Indonesia',
                'sector' => 'BUMN/BUMD',
                'address' => 'Jl. Japati No. 1, Bandung',
                'owner_name' => 'Manager HRD',
                'owner_email' => 'hrd@telkom.co.id',
                'owner_phone' => '022-452155',
            ],
            // Dinas
            [
                'name' => 'Dinas Kominfo',
                'sector' => 'Dinas',
                'address' => 'Jl. Medan Merdeka Barat No. 9',
                'owner_name' => 'Kepala Dinas',
                'owner_email' => 'humas@kominfo.go.id',
                'owner_phone' => '021-345212',
            ],

            // --- KATEGORI SWASTA (Mencakup Startup, Fintech, Agency, Technology, dll.) ---

            [
                'name' => 'Tokopedia',
                'sector' => 'Swasta',
                'address' => 'Tokopedia Tower, Jakarta',
                'owner_name' => 'William Tanuwijaya',
                'owner_email' => 'recruit@tokopedia.com',
                'owner_phone' => null,
            ],
            [
                'name' => 'Bank BCA',
                'sector' => 'Swasta',
                'address' => 'Menara BCA, Grand Indonesia',
                'owner_name' => 'HR Recruitment',
                'owner_email' => 'career@bca.co.id',
                'owner_phone' => null,
            ],
            [
                //id 5
                'name' => 'TechCorp',
                'sector' => 'Swasta',
                'address' => 'Gedung Digital, Jakarta',
                'owner_name' => 'CTO TechCorp',
                'owner_email' => 'hr@techcorp.id',
                'owner_phone' => null,
            ],
            [
                'name' => 'Kreatif Studio',
                'sector' => 'Swasta',
                'address' => 'Jl. Desain Kreatif No. 45, Bandung',
                'owner_name' => 'Lead Designer',
                'owner_email' => 'jobs@kreatifstudio.com',
                'owner_phone' => '022-987654',
            ],
            [
                'name' => 'FinTek Solutions',
                'sector' => 'Swasta',
                'address' => 'Tower Finansial, Jakarta',
                'owner_name' => 'Manager Data',
                'owner_email' => 'hrd@finteksolutions.com',
                'owner_phone' => null,
            ],
            [
                'name' => 'Cloud Provider Inc.',
                'sector' => 'Swasta',
                'address' => 'Pusat Data Mega Cloud, Jakarta',
                'owner_name' => 'DevOps Manager',
                'owner_email' => 'devops@cloudinc.com',
                'owner_phone' => null,
            ],
            [
                'name' => 'DevOps Automation Hub',
                'sector' => 'Swasta',
                'address' => 'Jl. Inovasi No. 10, Tangerang',
                'owner_name' => 'Engineering Lead',
                'owner_email' => 'career@devopsauto.com',
                'owner_phone' => null,
            ],
            [
                'name' => 'Mobile App Studio',
                'sector' => 'Swasta',
                'address' => 'Gedung Mobile, Yogyakarta',
                'owner_name' => 'HR Mobile',
                'owner_email' => 'jobs@mobileappstudio.com',
                'owner_phone' => null,
            ],
        ];

        foreach ($institutions as $data) {
            Internship::create(
                $data
            );
        }
    }
}
