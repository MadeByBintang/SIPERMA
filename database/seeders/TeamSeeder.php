<?php

namespace Database\Seeders;

use App\Models\Team;
use App\Models\TeamMember;
use Illuminate\Database\Seeder;


class TeamSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Cari Aktivitas yang baru dibuat
        $teams = [
            [
                // id 1
                'team_name'     => 'Syntaxius',
                'description'   => 'Best CP team in Information Technology',
                'members'       => [50, 5, 20]
            ],
            [
                'team_name'     => 'NDSC team A',
                'description'    => 'Ketuanya gani',
                'members'       => [7, 6, 52]
            ],
            [
                'team_name'     => 'AkuBenciMrD',
                'description'   => 'Kada jelas banar yo',
                'members'       => [50, 24, 28, 51]
            ],
            [
                'team_name'     => 'TolongIninyaDiAnukanDulu',
                'description'   => 'Lomba CTF gas gas gas',
                'members'       => [18, 35, 50, 27]
            ],
            [
                // id 5
                'team_name'     => 'YTTA',
                'description'   => 'Padahal ingin magang di Balangan',
                'members'       => [23, 25, 5]
            ],
            [
                'team_name'     => 'MatchaCraft',
                'description'   => 'Si paling kalcer',
                'members'       => [1, 40, 32, 19]
            ],
            [
                'team_name'     => 'DATA',
                'description'   => 'Ingin menjadi data analis handal namun enggan ngitung',
                'members'       => [2, 3, 11, 51]
            ],
            [
                'team_name'     => 'Cloud Bread',
                'description'   => 'Mamah aku ingin cloud bread',
                'members'       => [9, 15, 29, 37]
            ],
            [
                'team_name'     => 'Automation Goes Brr',
                'description'   => 'EZ ini mah',
                'members'       => [8, 24, 6, 44]
            ],
            [
                // id 10
                'team_name'     => 'Mobile is The Future',
                'description'   => 'Mending pakai kotlin, flutter, apa swift yak?',
                'members'       => [31, 18, 41, 26]
            ]
        ];

        foreach($teams as $team){
            $tm = Team::firstOrCreate([
                'team_name'          => $team['team_name'],
                'description'   => $team['description']
            ]);

            foreach($team['members'] as $member){
                TeamMember::firstOrCreate([
                    'team_id'       => $tm -> team_id,
                    'student_id'    => $member
                ]);
            }
        }
    }
}
