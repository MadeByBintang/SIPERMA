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
                'nim' => '2110817110001',
                'full_name' => 'MUHAMMAD AKBAR',
                'email' => 'akbargeming09@gmail.com'
            ],
            [
                'nim' => '2110817110005',
                'full_name' => 'MUHAMMAD ALGHIFARI',
                'email' => 'MUHAMMADALGHIFARI602@GMAIL.COM'
            ],
            [
                'nim' => '2110817110007',
                'full_name' => 'SEPTIAN DWI ANGGORO MOCHTAR',
                'email' => 'anggoromochtar@gmail.com'
            ],
            [
                'nim' => '2110817110008',
                'full_name' => 'ANDRI RAHMADANI',
                'email' => 'Andrirahmadani6@gmail.com'
            ],
            [
                'nim' => '2110817110009',
                'full_name' => 'MAULANA KHISYAM',
                'email' => 'MAULANAHISYAM0403@GMAIL.COM'
            ],
            [
                'nim' => '2110817110012',
                'full_name' => 'AKHIRATUL AKMAL AGUSTIANNOOR',
                'email' => 'akhiratul2002@gmail.com'
            ],
            [
                'nim' => '2110817120002',
                'full_name' => 'NOORHANI',
                'email' => '2110817120002@mhs.ulm.ac.id'
            ],
            [
                'nim' => '2110817120003',
                'full_name' => 'HENNY KARTIKA',
                'email' => 'mehennykartika@gmail.com'
            ],
            [
                'nim' => '2110817120004',
                'full_name' => 'ANNISA FITRIA',
                'email' => 'ANNISAA.FTRR@GMAIL.COM'
            ],
            [
                'nim' => '2110817120006',
                'full_name' => 'PUTRI OKTAVIANTI',
                'email' => '2110817120006@mhs.ulm.ac.id'
            ],
            [
                'nim' => '2110817120010',
                'full_name' => 'FARISA ADELIA',
                'email' => 'farisaadelia0@gmail.com'
            ],
            [
                'nim' => '2110817120011',
                'full_name' => 'SITI RAHMAH',
                'email' => 'STRHM01@GMAIL.COM'
            ],
            [
                'nim' => '2110817210001',
                'full_name' => 'MUHAMMAD QALBY',
                'email' => 'QOLBYMUHAMMAD86@GMAIL.COM'
            ],
            [
                'nim' => '2110817210005',
                'full_name' => 'M. RENALD ABDI',
                'email' => 'renaldabdi2104@gmail.com'
            ],
            [
                'nim' => '2110817210006',
                'full_name' => 'AHMADDIN NAJWAN',
                'email' => 'ahmaddinnajwan9@gmail.com'
            ],
            [
                'nim' => '2110817210007',
                'full_name' => 'ANDRI RAHMAN',
                'email' => 'Andrir0709@gmail.com'
            ],
            [
                'nim' => '2110817210008',
                'full_name' => 'M. TRIYUDHA RAMADHANI',
                'email' => 'MUHAMMADTRIYUDHARAMADHANI@GMAIL.COM'
            ],
            [
                'nim' => '2110817210009',
                'full_name' => 'MUHAMMAD KHAFIE RAMADHAN',
                'email' => 'khafieforschool@gmail.com'
            ],
            [
                'nim' => '2110817210010',
                'full_name' => 'M. ANDRI FIRDAUS',
                'email' => 'andrifirdaus932@gmail.com'
            ],
            [
                'nim' => '2110817210012',
                'full_name' => 'DWIPAYANA ISMULYA',
                'email' => 'dwipayanaismulya6@gmail.com'
            ],
            [
                'nim' => '2110817210013',
                'full_name' => 'MUHAMMAD CHAIRUR RIJAL',
                'email' => 'chairur211@gmail.com'
            ],
            [
                'nim' => '2110817210015',
                'full_name' => 'M. FARID PEBRIAN',
                'email' => 'farid32peb@gmail.com'
            ],
            [
                'nim' => '2110817210016',
                'full_name' => 'MUHAMMAD RAIHAN MAULANA',
                'email' => 'mraihanmaulana8@gmail.com'
            ],
            [
                'nim' => '2110817210017',
                'full_name' => 'MUHAMMAD MUMTAZA ZAIRINDA',
                'email' => 'michaelervana@gmail.com'
            ],
            [
                'nim' => '2110817210019',
                'full_name' => 'MUHAMMAD RAYHAN ZAYDAN',
                'email' => 'rathanzaydan@gmail.com'
            ],
            [
                'nim' => '2110817210020',
                'full_name' => 'MUHAMMAD SYAUQI AL FATH',
                'email' => 'SYAUQIALFATH25@GMAIL.COM'
            ],
            [
                'nim' => '2110817210022',
                'full_name' => 'MUHAMMAD HAFIZ',
                'email' => 'hafizkedua@gmail.com'
            ],
            [
                'nim' => '2110817210024',
                'full_name' => 'NAUFAL RIFKI ARFIZAIN',
                'email' => 'naufalarfizain@gmail.com'
            ],
            [
                'nim' => '2110817220002',
                'full_name' => 'ANNISA MAGHFIRAH',
                'email' => 'amarkunah@gmail.com'
            ],
            [
                'nim' => '2110817220003',
                'full_name' => 'SALSA MAULIDINA PUTERI',
                'email' => 'salsamputeri@gmail.com'
            ],
            [
                'nim' => '2110817220004',
                'full_name' => 'ADEN AULIA RAHMA',
                'email' => 'adenaulia5@gmail.com'
            ],
            [
                'nim' => '2110817220011',
                'full_name' => 'ANA NESTANIA',
                'email' => 'ana456431@gmail.com'
            ],
            [
                'nim' => '2110817220014',
                'full_name' => 'NAJWA DWI FEBRIANTI',
                'email' => 'najwadwi1@gmail.com'
            ],
            [
                'nim' => '2110817220018',
                'full_name' => 'DESSY FITRIAYA ANWARI',
                'email' => '2110817220018@mhs.ulm.ac.id'
            ],
            [
                'nim' => '2110817220021',
                'full_name' => 'ANYA FIDELA SOFIYANA ROCHANDI',
                'email' => 'anyafsr27@gmail.com'
            ],
            [
                'nim' => '2110817220023',
                'full_name' => 'NASYWA KAMILIA',
                'email' => 'nasywa.nk@gmail.com'
            ],
            [
                'nim' => '2110817310002',
                'full_name' => 'MUHAMMAD ASANDY PUTRA',
                'email' => 'asandyputra77@gmail.com'
            ],
            [
                'nim' => '2110817310003',
                'full_name' => 'M. RIZKI SIMANULLANG',
                'email' => 'Rizkisimanullang28@gmail.com'
            ],
            [
                'nim' => '2110817310004',
                'full_name' => 'MUHAMMAD UTIYA RAIHAN',
                'email' => 'raihan14032004@gmail.com'
            ],
            [
                'nim' => '2110817310005',
                'full_name' => 'MUHAMMAD FAUZAN NAUFAL RIDHO',
                'email' => 'ozannaufal@gmail.com'
            ],
            [
                'nim' => '2110817310007',
                'full_name' => 'M. RAMANDHA KURNIAWAN BATUBARA',
                'email' => 'RAMABATUBARA@GMAIL.COM'
            ],
            [
                'nim' => '2110817310008',
                'full_name' => 'MUHAMMAD KHALIQ TEUKU ANSARI',
                'email' => 'gebrelhaliq0507@gmail.com'
            ],
            [
                'nim' => '2110817310009',
                'full_name' => 'FAJAR HIDAYAT',
                'email' => 'hidayatfajar764@gmail.com'
            ],
            [
                'nim' => '2110817310010',
                'full_name' => 'M.AQIILA YUFANDA',
                'email' => 'muhammadqla1@gmail.com'
            ],
            [
                'nim' => '2110817310011',
                'full_name' => 'MUHAMMAD RAVI HIMAWAN',
                'email' => 'muhammadravihimawan@gmail.com'
            ],
            [
                'nim' => '2110817310012',
                'full_name' => 'AQIL RAHMATULLAH',
                'email' => 'aqilr54@gmail.com'
            ],
            [
                'nim' => '2110817310013',
                'full_name' => 'MUHAMMAD ANDRA FADHILLAH',
                'email' => 'andragowipe10@gmail.com'
            ],
            [
                'nim' => '2110817310014',
                'full_name' => 'MUHAMMAD AZHAR ABDURRAHMAN',
                'email' => 'm69905641@gmail.com'
            ],
            [
                'nim' => '2110817310015',
                'full_name' => 'M. FADHIL HAIKAL WARDANI',
                'email' => 'haikalfadhil37@gmail.com'
            ],
            [
                'nim' => '2110817310016',
                'full_name' => 'RICHARD ALEXANDER',
                'email' => 'alexanderrichard168@gmail.com'
            ],
            [
                'nim' => '2110817310018',
                'full_name' => 'MUHAMMAD HAFIZ',
                'email' => 'mhmmdhffzz@gmail.com'
            ],
            [
                'nim' => '2110817310019',
                'full_name' => 'M. AZHAR MUHAIMIN',
                'email' => 'azharmuhaimin63@gmail.com'
            ],
            [
                'nim' => '2110817320001',
                'full_name' => 'LIDYA RAHMI',
                'email' => 'LIDYARAHMI123@GMAIL.COM'
            ],
            [
                'nim' => '2110817320006',
                'full_name' => 'KAMANIA D.M',
                'email' => 'kamania.dm15@gmail.com'
            ],
            [
                'nim' => '2210817110001',
                'full_name' => 'AKHMAD RAIHAN RIDHA',
                'email' => 'RAIHANRIDA590@GMAIL.COM'
            ],
            [
                'nim' => '2210817110002',
                'full_name' => 'MUHAMMAD PASHA NABEEL',
                'email' => 'MPASHANABEEL83@GMAIL.COM'
            ],
            [
                'nim' => '2210817110005',
                'full_name' => 'M. IZZUDDIN ABDIS SALAM',
                'email' => 'ABDISDAMN@GMAIL.COM'
            ],
            [
                'nim' => '2210817110006',
                'full_name' => 'MOHAMMAD ZAKI FIRMANSAH ',
                'email' => '2210817110006@MHS.ULM.AC.ID'
            ],
            [
                'nim' => '2210817110008',
                'full_name' => 'ADITYA OKTAVIARI',
                'email' => 'ADITOKTA12345678@GMAIL.COM'
            ],
            [
                'nim' => '2210817110014',
                'full_name' => 'MUHAMMAD FIRAS',
                'email' => 'muhammadfiras332@gmail.com'
            ],
            [
                'nim' => '2210817120003',
                'full_name' => 'IKHTIARA FAKHRUNISA',
                'email' => 'IKHTIARAFAKHRUNISA@GMAIL.COM'
            ],
            [
                'nim' => '2210817120004',
                'full_name' => 'NOR AINA EVA YANTI',
                'email' => 'NORAINAEVAYANTII@GMAIL.COM'
            ],
            [
                'nim' => '2210817120007',
                'full_name' => 'NURSYAHNA PUTERI',
                'email' => 'SYAHNAPUTERII@GMAIL.COM'
            ],
            [
                'nim' => '2210817120009',
                'full_name' => 'NAJAH MAISYAROH',
                'email' => '2210817120009@MHS.ULM.AC.ID'
            ],
            [
                'nim' => '2210817120010',
                'full_name' => 'NIKKY VIOFANA',
                'email' => '2210817120010@mhs.ulm.ac.id'
            ],
            [
                'nim' => '2210817120011',
                'full_name' => 'MAULIDASARI',
                'email' => 'MAULIDASARI1508@GMAIL.COM'
            ],
            [
                'nim' => '2210817120012',
                'full_name' => 'NOORLAINI MARRATAIN',
                'email' => 'MARRATAIN@GMAIL.COM'
            ],
            [
                'nim' => '2210817120013',
                'full_name' => 'FATHIAH NURAISYAH RADAM ',
                'email' => 'FATHIAHNR570@GMAIL.COM'
            ],
            [
                'nim' => '2210817210002',
                'full_name' => 'GUSTI MUHAMMAD NAUFAL RAZIN',
                'email' => 'NAUFAL190903@GMAIL.COM'
            ],
            [
                'nim' => '2210817210003',
                'full_name' => 'MUHAMMAD HAFIZ ANSARI',
                'email' => 'MHMMDHAFIZANSARI12@GMAIL.COM'
            ],
            [
                'nim' => '2210817210005',
                'full_name' => 'M. FITHRA SIROJA',
                'email' => 'FITHRASIROJA25@GMAIL.COM'
            ],
            [
                'nim' => '2210817210006',
                'full_name' => 'FARLYHAYDY H. DJALIL',
                'email' => '2210817210006@MHS.ULM.AC.ID'
            ],
            [
                'nim' => '2210817210008',
                'full_name' => 'BIMA SANJAYA',
                'email' => '2210817210008@MHS.ULM.AC.ID'
            ],
            [
                'nim' => '2210817210010',
                'full_name' => 'ERIC NANDA FERDIAN',
                'email' => 'ERIC95FERDIAN@GMAIL.COM'
            ],
            [
                'nim' => '2210817210012',
                'full_name' => 'MUHAMMAD RAKA AZWAR',
                'email' => 'MRAKAAZWAR@GMAIL.COM'
            ],
            [
                'nim' => '2210817210013',
                'full_name' => 'MUHAMMAD SHANDY DAILAMI',
                'email' => 'SHANDYDAILAMI@GMAIL.COM'
            ],
            [
                'nim' => '2210817210014',
                'full_name' => 'MUHAMMAD QOHARY RAWIDAFANY',
                'email' => 'HARI.HUJAN71@GMAIL.COM'
            ],
            [
                'nim' => '2210817210015',
                'full_name' => 'MUHAMMAD IRFAN',
                'email' => 'mirfan200404@gmail.com'
            ],
            [
                'nim' => '2210817210016',
                'full_name' => 'AHMAD REZA ALFAYIET',
                'email' => 'rezaaaaa6821@gmail.com'
            ],
            [
                'nim' => '2210817210017',
                'full_name' => 'M. ADI SYAHPUTRA',
                'email' => 'ADISYAHPUTRA2707@GMAIL.COM'
            ],
            [
                'nim' => '2210817210021',
                'full_name' => 'TRISNA CAHYA PERMADI',
                'email' => 'TRISNAPERMADI7@GMAIL.COM'
            ],
            [
                'nim' => '2210817210023',
                'full_name' => 'MUHAMMAD SHOFY AKMAL',
                'email' => 'SHOFYAKMAL@GMAIL.COM'
            ],
            [
                'nim' => '2210817210025',
                'full_name' => 'MUHAMMAD KHOLID SYAIFULLAH',
                'email' => 'MKSYAIFULLAH21@GMAIL.COM'
            ],
            [
                'nim' => '2210817210026',
                'full_name' => 'ZULFA AULIYA AKBAR',
                'email' => 'BACKUP02IZUL@GMAIL.COM'
            ],
            [
                'nim' => '2210817210028',
                'full_name' => 'MUHAMMAD AULIA RASYID',
                'email' => 'MAULIARASYID6@GMAIL.COM'
            ],
            [
                'nim' => '2210817210031',
                'full_name' => 'KEVIN MALEAKHI',
                'email' => 'MALEAKHI71@GMAIL.COM'
            ],
            [
                'nim' => '2210817210032',
                'full_name' => 'FRANSISKUS ASSISI INDRA WIJAYA',
                'email' => 'indrawijaya1501@gmail.com'
            ],
            [
                'nim' => '2210817210033',
                'full_name' => 'HARI OCTAVIAN DELROSSI',
                'email' => 'OCTAVIANHARI@GMAIL.COM'
            ],
            [
                'nim' => '2210817220001',
                'full_name' => 'AJENG DIAH PRAMESTI',
                'email' => 'AJENGPRAMESTI37.AP@GMAIL.COM'
            ],
            [
                'nim' => '2210817220004',
                'full_name' => 'MELISA ANGGINI',
                'email' => 'MELISAANGGINI92@GMAIL.COM'
            ],
            [
                'nim' => '2210817220007',
                'full_name' => 'AISYA ANINDIA SEPTHA',
                'email' => 'AISYAANINDIASEPTHA@GMAIL.COM'
            ],
            [
                'nim' => '2210817220009',
                'full_name' => 'AZKA AMALIA',
                'email' => 'AZKAAMALIA200@GMAIL.COM'
            ],
            [
                'nim' => '2210817220011',
                'full_name' => 'MELDIANA HANDAYANI',
                'email' => 'IMELMELDIANA73@GMAIL.COM'
            ],
            [
                'nim' => '2210817220018',
                'full_name' => 'PIOLA EVANIA',
                'email' => 'PIOLAEVANIA@GMAIL.COM'
            ],
            [
                'nim' => '2210817220019',
                'full_name' => 'DHEA APRILINDA UTAMI',
                'email' => 'DHEAAPRILINDA@GMAIL.COM'
            ],
            [
                'nim' => '2210817220020',
                'full_name' => 'HELENA ROSALINA',
                'email' => 'HELENAROSALINA10@GMAIL.COM'
            ],
            [
                'nim' => '2210817220022',
                'full_name' => 'RAYFHA ZAFIRA  AZ-ZAHRA',
                'email' => 'RAYFHAZFR@GMAIL.COM'
            ],
            [
                'nim' => '2210817220024',
                'full_name' => 'ALDIRA PUTRI SHOLEHA',
                'email' => '2210817220024@MHS.ULM.AC.ID'
            ],
            [
                'nim' => '2210817220027',
                'full_name' => 'ERIKA TIO AULIA',
                'email' => 'erikatio61@gmail.com'
            ],
            [
                'nim' => '2210817220029',
                'full_name' => 'SITI AINUR RAHMAWATI',
                'email' => 'SAINURRAHMAWATI@GMAIL.COM'
            ],
            [
                'nim' => '2210817220030',
                'full_name' => 'VALENCIA ANGELIN NATA',
                'email' => 'VALENCIANATAANGEL@GMAIL.COM'
            ],
            [
                'nim' => '2210817220034',
                'full_name' => 'WANDA KARLIYANTI',
                'email' => 'WKARLIYANTI@GMAIL.COM'
            ],
            [
                'nim' => '2210817310001',
                'full_name' => 'MUHAMMAD RYAN RIZKY RAHMADI',
                'email' => 'RYANRIZKYRAHMADISUCCESS@GMAIL.COM'
            ],
            [
                'nim' => '2210817310002',
                'full_name' => 'MUHAMMAD RIDHO PRASETYA',
                'email' => 'prasetyaridho05@gmail.com'
            ],
            [
                'nim' => '2210817310003',
                'full_name' => 'ADINERADO FALAH NUGRAHA',
                'email' => '2210817310003@MHS.ULM.AC.ID'
            ],
            [
                'nim' => '2210817310005',
                'full_name' => 'IKHSAN GYMNASTIAR',
                'email' => '2210817310005@MHS.ULM.AC.ID'
            ],
            [
                'nim' => '2210817310006',
                'full_name' => 'AHMAD MUHSIN ZEIN',
                'email' => 'ZEINKPZ26@GMAIL.COM'
            ],
            [
                'nim' => '2210817310007',
                'full_name' => 'HAFIZH PRATAMA BUDIMAN',
                'email' => 'HAFIZH1087@GMAIL.COM'
            ],
            [
                'nim' => '2210817310008',
                'full_name' => 'MUH. HAEKAL BARERA',
                'email' => 'haekal14102002@gmail.com'
            ],
            [
                'nim' => '2210817310009',
                'full_name' => 'MARIO FRANCA WIJAYA',
                'email' => '2210817310009@MHS.ULM.AC.ID'
            ],
            [
                'nim' => '2210817310010',
                'full_name' => 'AERON TJITRADI',
                'email' => 'AERONTJITRADI19@GMAIL.COM'
            ],
            [
                'nim' => '2210817310011',
                'full_name' => 'M.DAFFA AZ-ZIKRA',
                'email' => '2210817310011@MHS.ULM.AC.ID'
            ],
            [
                'nim' => '2210817310012',
                'full_name' => 'NIZAR ALI',
                'email' => 'ARENALDI220@GMAIL.COM'
            ],
            [
                'nim' => '2210817310013',
                'full_name' => 'RYAN MUHAMMAD IRFAN',
                'email' => '2210817310013@MHS.ULM.AC.ID'
            ],
            [
                'nim' => '2210817310014',
                'full_name' => 'FATIH ALIF GHIFARI ',
                'email' => 'FATIHALIFGHIFARI18@GMAIL.COM'
            ],
            [
                'nim' => '2210817310015',
                'full_name' => 'RIDHANI SETIADI',
                'email' => 'RIDHANISETIADI08@GMAIL.COM'
            ],
            [
                'nim' => '2210817310016',
                'full_name' => 'RIYO AURORA GUISON',
                'email' => 'POLICEGAMING8@GMAIL.COM'
            ],
            [
                'nim' => '2210817310017',
                'full_name' => 'ROHID AKMAL',
                'email' => 'ROHIDAKMAL.AM@GMAIL.COM'
            ],
            [
                'nim' => '2210817310018',
                'full_name' => 'AHMAD JULIANOOR',
                'email' => 'anoy11323388y@gmail.com'
            ],
            [
                'nim' => '2210817710001',
                'full_name' => 'ADY TEMPOMONA ADILANG',
                'email' => 'ADY.ADILANG07@GMAIL.COM'
            ],
            [
                'nim' => '2310817110004',
                'full_name' => 'ABDURRAHMAN GILANG HARJUNA',
                'email' => 'KAIZER354313@GMAIL.COM'
            ],
            [
                'nim' => '2310817110006',
                'full_name' => 'ADRIAN BINTANG SAPUTERA ',
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
