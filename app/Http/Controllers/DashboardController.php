<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Team;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Activity;
use App\Models\Lecturer;
use App\Models\Supervision;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $user->load('role', 'student.teamMembers.team.activity', 'lecturer.supervisions.activity');


        $activities = collect();
        if ($user->role->role_name === 'admin') {

            $activities = Activity::with('activityType')->latest()->take(5)->get();
        } elseif ($user->role->role_name === 'dosen') {
            if ($user->lecturer) {
                $activities = $user->lecturer->supervisions->map(function ($supervision) {
                    return $supervision->activity;
                })->unique()->values();
            }
        } elseif ($user->role->role_name === 'mahasiswa') {
            if ($user->student) {
                $activities = $user->student->teamMembers->map(function ($teamMember) {
                    return $teamMember->team->activity;
                })->unique()->values();
            }
        }

        if ($user->role->role_name === 'admin') {
            $totalPkl = Activity::whereHas('activityType', fn($q) => $q->where('type_name', 'Internship'))->count();
            $totalThesis = Activity::whereHas('activityType', fn($q) => $q->where('type_name', 'Thesis'))->count();
            $totalCompetition = Activity::whereHas('activityType', fn($q) => $q->where('type_name', 'Competition'))->count();

            $systemStats = [
                'totalStudents' => User::whereHas('role', fn($q) => $q->where('role_name', 'mahasiswa'))->count(),
                'totalLecturers' => User::whereHas('role', fn($q) => $q->where('role_name', 'dosen'))->count(),
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
                'stats' => $this -> stats(),
            ]);
        }


        $stats = [
            'total_students' => User::whereHas('role', fn($q) => $q->where('role_name', 'mahasiswa'))->count(),
            'total_lecturers' => User::whereHas('role', fn($q) => $q->where('role_name', 'dosen'))->count(),
            'active_relations' => Supervision::count(),
            'pending_matches' => Supervision::where('supervision_status', 'Pending')->count(),
        ];


        return Inertia::render('Dashboard', [
            'activities' => $activities,
            'stats' => $stats,
        ]);
    }

    private function stats()
    {
        $supervisions = Supervision::with(['student.user', 'lecturer.user', 'activity'])->get();

        $totalProjects = $supervisions->count();
        $activeSupervisions = $supervisions->filter(fn($s) => in_array(strtolower($s->supervision_status), ['approved']))->count();
        $totalActive = $activeSupervisions;

        $completedSupervisions = $supervisions->filter(fn($s) => strtolower($s->supervision_status) === 'completed')->count();
        $totalCompleted = $completedSupervisions;

        $totalSupervisors = Lecturer::count();
        $avgStudents = $totalSupervisors > 0 ? round($totalProjects / $totalSupervisors, 1) : 0;

        $stats = [
            'totalProjects' => $totalProjects,
            'activeProjects' => $totalActive,
            'completedProjects' => $totalCompleted,
            'totalSupervisors' => $totalSupervisors,
            'avgStudentsPerSupervisor' => $avgStudents,
        ];

        return $stats;
    }


    public function exportPdf()
    {
        $supervisions = Supervision::with(['student.user', 'lecturer.user', 'activity'])->get();
        $teams = Team::with(['supervision.student', 'supervision.lecturer'])->get();

        $totalProjects = $supervisions->count() + $teams->count();
        $activeSupervisions = $supervisions->filter(fn($s) => in_array(strtolower($s->supervision_status), ['active', 'ongoing', 'approved']))->count();
        $activeTeams = $teams->filter(fn($t) => in_array(strtolower($t->supervision?->supervision_status), ['active', 'ongoing']))->count();
        $totalActive = $activeSupervisions;

        $completedSupervisions = $supervisions->filter(fn($s) => strtolower($s->supervision_status) === 'completed')->count();
        $completedTeams = $teams->filter(fn($t) => strtolower($t->supervision?->supervision_status) === 'completed')->count();
        $totalCompleted = $completedSupervisions ;

        $totalSupervisors = Lecturer::count();
        $avgStudents = $totalSupervisors > 0 ? round($totalProjects / $totalSupervisors, 1) : 0;

        $distribution = [
            'pkl' => $supervisions->where('activity.activity_type_id', 2)->count(),
            'thesis' => $supervisions->where('activity.activity_type_id', 1)->count(),
            'competition' => $supervisions->where('activity.activity_type_id', 3)->count()
        ];

        $stats = compact('totalProjects', 'totalActive', 'totalCompleted', 'totalSupervisors', 'avgStudents', 'distribution');

        $pdf = Pdf::loadView('pdf.reports.admin', ['stats' => $stats]);

        return $pdf->download('system-reports.pdf');
    }
}
