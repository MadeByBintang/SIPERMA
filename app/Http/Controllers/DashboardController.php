<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Activity;
use App\Models\User;
use App\Models\Role;
use App\Models\Supervision;

class DashboardController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        $user->load('role', 'student.teamMembers.team.activity', 'lecturer.supervisions.activity');

        
        $activities = collect();
        if ($user->role->role_name === 'Admin') {
         
            $activities = Activity::with('activityType')->latest()->take(5)->get();
        } elseif ($user->role->role_name === 'Dosen') {
            if ($user->lecturer) {
                $activities = $user->lecturer->supervisions->map(function ($supervision) {
                    return $supervision->activity;
                })->unique()->values();
            }
        } elseif ($user->role->role_name === 'Mahasiswa') {
            if ($user->student) {
                $activities = $user->student->teamMembers->map(function ($teamMember) {
                    return $teamMember->team->activity;
                })->unique()->values();
            }
        }

        if ($user->role->role_name === 'Admin') {
            
            
            $totalPkl = Activity::whereHas('activityType', fn($q) => $q->where('type_name', 'PKL'))->count();
            $totalThesis = Activity::whereHas('activityType', fn($q) => $q->where('type_name', 'Thesis'))->count();
            $totalCompetition = Activity::whereHas('activityType', fn($q) => $q->where('type_name', 'Competition'))->count();

            $systemStats = [
                'totalStudents' => User::whereHas('role', fn($q) => $q->where('role_name', 'Mahasiswa'))->count(),
                'totalLecturers' => User::whereHas('role', fn($q) => $q->where('role_name', 'Dosen'))->count(),
                'activeProjects' => [
                    'pkl' => $totalPkl,
                    'thesis' => $totalThesis,
                    'competition' => $totalCompetition,
                ],
                'pendingApprovals' => Supervision::where('supervision_status', 'Pending')->count(),
                'approvedGuidance' => Supervision::where('supervision_status', 'Approved')->count(),
                'rejectedGuidance' => Supervision::where('supervision_status', 'Rejected')->count(),
            ];

        
            return Inertia::render('AdminDashboardPage', [
                'systemStats' => $systemStats, 
                'notifications' => [], 
            ]);
        }


        $stats = [
            'total_students' => User::whereHas('role', fn($q) => $q->where('role_name', 'Mahasiswa'))->count(),
            'total_lecturers' => User::whereHas('role', fn($q) => $q->where('role_name', 'Dosen'))->count(),
            'active_relations' => Supervision::count(), 
            'pending_matches' => Supervision::where('supervision_status', 'Pending')->count(),
        ];

    
        return Inertia::render('Dashboard', [
            'activities' => $activities,
            'stats' => $stats,
        ]);
    }
}