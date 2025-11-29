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
        $students = [
            [
                'nim' => '9910817119999',
                'full_name' => 'Erika Maulidiya',
                'email' => '9910817119999@ulm.ac.id'
            ],
            [
                'nim' => '2310817110004',
                'full_name' => 'ABDURRAHMAN GILANG HARJUNA',
                'email' => 'KAIZER354313@GMAIL.COM'
            ],
            [
                'nim' => '2310817110006',
                'full_name' => 'ADRIAN BINTANG SAPUTERA',
                'email' => 'adrianbintang3@gmail.com'
            ],
            [
                'nim' => '2310817110007',
                'full_name' => 'MUHAMMAD DAFFA MUSYAFA',
                'email' => 'daffamusyafa1@gmail.com'
            ],
            [
                'nim' => '2310817110008',
                'full_name' => 'MUHAMMAD RAIHAN',
                'email' => 'mr799903@gmail.com'
            ],
            [
                'nim' => '2310817110011',
                'full_name' => 'GHANI MUDZAKIR',
                'email' => 'ghanimdzkr3@gmail.com'
            ],
            [
                'nim' => '2310817110013',
                'full_name' => 'RANDY FEBRIAN',
                'email' => 'RNDDFEBRIAN@GMAIL.COM'
            ],
            [
                'nim' => '2310817110015',
                'full_name' => 'AKHMAD CHAIDAR ANANDA',
                'email' => 'CHAIDARMERAK1966@GMAIL.COM'
            ],
            [
                'nim' => '2310817120001',
                'full_name' => 'DINA IZZATI ELFADHEYA',
                'email' => 'WIDYADINA55@GMAIL.COM'
            ],
            [
                'nim' => '2310817120002',
                'full_name' => 'SITI RATNA DWINTA SARI',
                'email' => 'PINCIYE189@GMAIL.COM'
            ],
            [
                'nim' => '2310817120003',
                'full_name' => 'NATALIE GRACE KATIANDAGHO',
                'email' => 'NATALIEGRACEKATIANDAGHO@GMAIL.COM'
            ],
            [
                'nim' => '2310817120005',
                'full_name' => 'NOVIANA NUR AISYAH',
                'email' => 'noviana21na@gmail.com'
            ],
            [
                'nim' => '2310817120009',
                'full_name' => 'ALYSA ARMELIA',
                'email' => 'ARMELIA.ALYSA@GMAIL.COM'
            ],
            [
                'nim' => '2310817120010',
                'full_name' => 'NUR HIKMAH',
                'email' => 'NURRRHIKMAH111@GMAIL.COM'
            ],
            [
                'nim' => '2310817120012',
                'full_name' => 'RIRIN CITRA LESTARI',
                'email' => 'RIRINCCITRA@GMAIL.COM'
            ],
            [
                'nim' => '2310817120014',
                'full_name' => 'ALIYA RAFFA NAURA AYU',
                'email' => '2310817120014@mhs.ulm.ac.id'
            ],
            [
                'nim' => '2310817210001',
                'full_name' => 'ANDRA BRAPUTRA AKBAR SALEH',
                'email' => 'AANDRAAA24@GMAIL.COM'
            ],
            [
                'nim' => '2310817210003',
                'full_name' => 'MUHAMMAD AZRIANZAN',
                'email' => 'MUHAMMADAZRIANZAN@GMAIL.COM'
            ],
            [
                'nim' => '2310817210004',
                'full_name' => 'ALLANO LINTANG ERTANTORA',
                'email' => 'allanobro@gmail.com'
            ],
            [
                'nim' => '2310817210005',
                'full_name' => 'GALIH AJI SABDARAYA',
                'email' => 'GALIJI57@GMAIL.COM'
            ],
            [
                'nim' => '2310817210006',
                'full_name' => 'MUHAMMAD RAIHAN ANSHARI',
                'email' => 'raihananshari66@gmail.com'
            ],
            [
                'nim' => '2310817210007',
                'full_name' => 'RAYMOND HARIYONO',
                'email' => 'hariyonoraymond@gmail.com'
            ],
            [
                'nim' => '2310817210009',
                'full_name' => 'MUHAMMAD IBNU SINA',
                'email' => 'IBNUMUHAMMAD837@GMAIL.COM'
            ],
            [
                'nim' => '2310817210010',
                'full_name' => 'HARRY PRATAMA YUNUS',
                'email' => 'HARRYPRATAMAYUNUS@GMAIL.COM'
            ],
            [
                'nim' => '2310817210012',
                'full_name' => 'NAZMI HAKIM',
                'email' => 'NAZMIHAKIM110382@GMAIL.COM'
            ],
            [
                'nim' => '2310817210013',
                'full_name' => 'MUHAMMAD AUFA FITRIANDA',
                'email' => 'MUHAMMADAUFAFITRIANDA@GMAIL.COM'
            ],
            [
                'nim' => '2310817210014',
                'full_name' => 'DAMARJATI SURYO LAKSONO',
                'email' => 'DAMARJATI2A@GMAIL.COM'
            ],
            [
                'nim' => '2310817210015',
                'full_name' => 'MUHAMMAD BUKHARI FITRI',
                'email' => 'bukharihari123@gmail.com'
            ],
            [
                'nim' => '2310817210019',
                'full_name' => 'NAUFAL ELYZAR',
                'email' => 'NAUFAL111EL@GMAIL.COM'
            ],
            [
                'nim' => '2310817210020',
                'full_name' => 'MUHAMMAD HASBIYAN RUSYADI',
                'email' => 'HASBIEROSYADDD@GMAIL.COM'
            ],
            [
                'nim' => '2310817210022',
                'full_name' => 'MUHAMMAD ADH-DHIYA\'US SALIM',
                'email' => 'M.ADHIYA.US@GMAIL.COM'
            ],
            [
                'nim' => '2310817210023',
                'full_name' => 'RIFKY PUTRA MAHARDIKA',
                'email' => '2310817210023@mhs.ulm.ac.id'
            ],
            [
                'nim' => '2310817210026',
                'full_name' => 'MUHAMMAD PUTRA AZKY ALFANI',
                'email' => 'ALFANIAZKY@GMAIL.COM'
            ],
            [
                'nim' => '2310817210027',
                'full_name' => 'MUHAMMAD ERZA RAIHAN',
                'email' => 'ERZARAIHAN7@GMAIL.COM'
            ],
            [
                'nim' => '2310817210029',
                'full_name' => 'PUTRA WHYRA PRATAMA S',
                'email' => 'PUTRAWHYRA@GMAIL.COM'
            ],
            [
                'nim' => '2310817220002',
                'full_name' => 'RAUDATUL SHOLEHAH',
                'email' => 'RAUDTLSHOLHH27@GMAIL.COM'
            ],
            [
                'nim' => '2310817220008',
                'full_name' => 'ATHAYA LAILY SYAFITRI',
                'email' => 'athaya.laily.1316@gmail.com'
            ],
            [
                'nim' => '2310817220011',
                'full_name' => 'REGINA SILVA MAHARATINI',
                'email' => 'RGNASISIL@GMAIL.COM'
            ],
            [
                'nim' => '2310817220016',
                'full_name' => 'NAILA HANIFAH',
                'email' => 'NAILAHNFA@GMAIL.COM'
            ],
            [
                'nim' => '2310817220018',
                'full_name' => 'DEVI HAFIDA ARIYANI',
                'email' => 'HAFIDADEVI@GMAIL.COM'
            ],
            [
                'nim' => '2310817220024',
                'full_name' => 'DESSY NURULITA',
                'email' => 'DESSYNRLITA@GMAIL.COM'
            ],
            [
                'nim' => '2310817220025',
                'full_name' => 'FIRDA KHOIRUNISA',
                'email' => 'FIRDAKHRNS925@GMAIL.COM'
            ],
            [
                'nim' => '2310817220028',
                'full_name' => 'SHEILA SABINA',
                'email' => 'SABINASHEILA325@GMAIL.COM'
            ],
            [
                'nim' => '2310817310001',
                'full_name' => 'AVANTIO FIERZA PATRIA',
                'email' => 'AVANTIO.FIERZA@GMAIL.COM'
            ],
            [
                'nim' => '2310817310002',
                'full_name' => 'JOVAN GILBERT NATAMASINDAH',
                'email' => 'JOVANGILBERT7160@GMAIL.COM'
            ],
            [
                'nim' => '2310817310003',
                'full_name' => 'M.FARID SETIAWAN',
                'email' => 'FARIDSETIAWAN47@GMAIL.COM'
            ],
            [
                'nim' => '2310817310004',
                'full_name' => 'M SAMIL RENDY NOR SALEH ',
                'email' => 'RENDY310105@GMAIL.COM'
            ],
            [
                'nim' => '2310817310005',
                'full_name' => 'MUHAMMAD NURWAHYUDI ADHITAMA',
                'email' => 'muhammadnurwahyudi2@gmail.com'
            ],
            [
                'nim' => '2310817310008',
                'full_name' => 'MUHAMMAD RIZKI RAMADHAN',
                'email' => 'MR.RIZKIRMDHN@GMAIL.COM'
            ],
            [
                'nim' => '2310817310009',
                'full_name' => 'MUHAMMAD FAUZAN AHSANI',
                'email' => 'MHDFAUZANAHSANI@GMAIL.COM'
            ],
            [
                'nim' => '2310817310010',
                'full_name' => 'AKMALLULLAIL SYA\'BAN',
                'email' => 'AKMALSYABAN123@GMAIL.COM'
            ],
            [
                'nim' => '2310817310011',
                'full_name' => 'MUHAMMAD RIZKY',
                'email' => 'RIZKY09SULAIMAN@GMAIL.COM'
            ],
            [
                'nim' => '2310817310012',
                'full_name' => 'MUHAMMAD AZWIN HAKIM',
                'email' => 'AZWINHAKIM35@GMAIL.COM'
            ],
            [
                'nim' => '2310817310014',
                'full_name' => 'MUHAMMAD RIZKI SAPUTRA',
                'email' => 'MHMDRIZKISPTRAA@GMAIL.COM'
            ],
            [
                'nim' => '2310817320006',
                'full_name' => 'ALYA ROSAAN',
                'email' => 'ALYAROSAAN0510@GMAIL.COM'
            ],
            [
                'nim' => '2310817320007',
                'full_name' => 'ZAHRA NABILA',
                'email' => 'ZHR.NABIL4@GMAIL.COM'
            ],
            [
                'nim' => '2310817320013',
                'full_name' => 'AIKO ANATASHA WENDIONO',
                'email' => 'AIKOANATASHAWENDIONO@GMAIL.COM'
            ],
            [
                'nim' => '2310817320015',
                'full_name' => 'ALFISYAH RINA FAJRIATI',
                'email' => 'SYAHRN911@GMAIL.COM'
            ]
        ];

        MasterStudent::insert($students);
    }
}
