<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Activity;

class ActivitySeeder extends Seeder
{
    public function run(): void
    {
        $activitiesData = [
            [
                // id 1
                'activity_type_id' => 3,
                'title' => 'Competitive Programming Compfest 17',
                'description' => 'Lomba Competitive Programming di Compfest 17 Fasilkom UI.',
                'start_date' => '2025-07-01',
                'end_date' => '2025-08-31',
            ],
            [
                'activity_type_id' => 3,
                'title' => 'National Data Science Challenge (NDSC)',
                'description' => 'Kompetisi analisis data dan machine learning tingkat nasional.',
                'start_date' => '2025-03-15',
                'end_date' => '2025-05-30',
            ],
            [
                'activity_type_id' => 3,
                'title' => 'Hackathon Inovasi AI',
                'description' => 'Pengembangan solusi AI cepat dalam waktu 48 jam.',
                'start_date' => '2025-12-10',
                'end_date' => '2025-12-24',
            ],
            [
                'activity_type_id' => 3,
                'title' => 'Cyber Security Capture The Flag (CTF)',
                'description' => 'Tantangan keamanan siber dan penetrasi sistem.',
                'start_date' => '2025-09-05',
                'end_date' => '2025-09-06',
            ],

            [
                // id 5
                'activity_type_id' => 2,
                'internship_id' => 5,
                'title' => 'Backend Development Internship at TechCorp',
                'description' => 'Magang sebagai Backend Developer di startup teknologi TechCorp.',
                'start_date' => '2025-06-01',
                'end_date' => '2025-08-31',
            ],
            [
                'activity_type_id' => 2,
                'internship_id' => 6,
                'title' => 'UI/UX Design at Kreatif Studio',
                'description' => 'Proyek perancangan antarmuka pengguna selama 4 bulan.',
                'start_date' => '2025-12-05',
                'end_date' => '2026-02-17',
            ],
            [
                'activity_type_id' => 2,
                'internship_id' => 7,
                'title' => 'Data Analyst Internship at FinTek',
                'description' => 'Magang analisis data keuangan di perusahaan FinTek.',
                'start_date' => '2025-07-01',
                'end_date' => '2025-09-30',
            ],
            [
                'activity_type_id' => 2,
                'internship_id' => 8,
                'title' => 'Cloud Computing Deployment Project',
                'description' => 'Penempatan di perusahaan Cloud untuk mengelola infrastruktur AWS/Azure.',
                'start_date' => '2025-04-15',
                'end_date' => '2025-07-15',
            ],

            [
                'activity_type_id' => 1,
                'title' => 'Analisis Sentimen Twitter Menggunakan Deep Learning',
                'description' => 'Penelitian tugas akhir mengenai pemodelan sentimen media sosial dengan arsitektur LSTM.',
                'start_date' => '2025-02-01',
                'end_date' => '2025-08-01',
            ],
            [
                // id 10
                'activity_type_id' => 1,
                'title' => 'Perancangan Sistem Rekomendasi E-commerce',
                'description' => 'Pengembangan sistem rekomendasi berbasis kolaboratif filtering.',
                'start_date' => '2025-01-05',
                'end_date' => '2025-07-05',
            ],
            [
                'activity_type_id' => 1,
                'title' => 'Implementasi Blockchain untuk Sistem Voting Aman',
                'description' => 'Studi kasus dan implementasi teknologi blockchain pada sistem pemilihan.',
                'start_date' => '2025-03-20',
                'end_date' => '2025-10-20',
            ],
            [
                'activity_type_id' => 1,
                'title' => 'Optimasi Algoritma Penjadwalan Cloud Computing',
                'description' => 'Peningkatan efisiensi penjadwalan sumber daya virtual machine.',
                'start_date' => '2025-04-01',
                'end_date' => '2025-11-01',
            ],
            [
                'activity_type_id' => 1,
                'title' => 'Deteksi Objek Real-time dengan YOLOv8',
                'description' => 'Penerapan model deteksi objek untuk studi kasus pengawasan lalu lintas.',
                'start_date' => '2025-06-15',
                'end_date' => '2025-12-15',
            ],

            // --- MIXED ACTIVITIES (Lanjutan) ---
            [
                'activity_type_id' => 3,
                'title' => 'Business Case Competition',
                'description' => 'Kompetisi pengembangan proposal bisnis digital.',
                'start_date' => '2025-11-01',
                'end_date' => '2025-12-10',
            ],
            [
                // id 15
                'activity_type_id' => 2,
                'internship_id' => 9,
                'title' => 'DevOps Automation Internship',
                'description' => 'Magang fokus pada CI/CD pipeline dan Kubernetes.',
                'start_date' => '2025-02-01',
                'end_date' => '2025-04-30',
            ],
            [
                'activity_type_id' => 1,
                'title' => 'Analisis Big Data Menggunakan Apache Spark',
                'description' => 'Tugas akhir eksplorasi data besar dengan kerangka kerja Spark.',
                'start_date' => '2025-09-01',
                'end_date' => '2026-03-01',
            ],
            [
                'activity_type_id' => 3,
                'title' => 'IoT Innovation Challenge',
                'description' => 'Lomba pembuatan prototipe perangkat Internet of Things.',
                'start_date' => '2025-06-10',
                'end_date' => '2025-07-20',
            ],
            [
                'activity_type_id' => 2,
                'internship_id' => 10,
                'title' => 'Mobile App Development Internship',
                'description' => 'Magang pengembangan aplikasi mobile cross-platform.',
                'start_date' => '2025-04-01',
                'end_date' => '2025-06-30',
            ],
            [
                // id 19
                'activity_type_id' => 1,
                'title' => 'Rancang Bangun Sistem Informasi Akademik',
                'description' => 'Pengembangan ulang sistem informasi akademik kampus.',
                'start_date' => '2025-01-01',
                'end_date' => '2025-09-01',
            ],
        ];

        foreach ($activitiesData as $data) {
            Activity::create($data);
        }
    }
}
