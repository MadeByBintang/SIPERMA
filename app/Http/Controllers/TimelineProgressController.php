<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TimelineProgressController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Map role_id ke role_name sesuai DB (sama seperti di MatchingController)
        $roleName = match ($user->role_id) {
            1 => 'admin',
            2 => 'dosen',
            3 => 'mahasiswa',
            default => 'mahasiswa',
        };

        // Contoh data timeline, nanti bisa diganti dengan query database
        $timelineData = [
            [
                'id' => 1,
                'title' => 'Proposal Submission',
                'status' => 'Completed',
                'date' => '2025-10-01',
            ],
            [
                'id' => 2,
                'title' => 'Midterm Review',
                'status' => 'In Progress',
                'date' => '2025-11-10',
            ],
            [
                'id' => 3,
                'title' => 'Final Submission',
                'status' => 'Pending',
                'date' => '2025-12-20',
            ],
        ];

        return inertia('TimelineProgressPage', [
            'currentUserName' => $user->username,
            'userRole' => $roleName,
            'timelineData' => $timelineData,
        ]);
    }
}
