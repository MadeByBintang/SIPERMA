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
        if ($user -> role_name === 'dosen'){
            $lecturer_id = $user->lecturer->lecturer_id;

            $supervisions = Supervision::with([
                'student.user', // Untuk mengambil nama ketua/pengaju
                'activity',     // Untuk mengambil judul aktivitas (title)
            ])
            ->where('lecturer_id', $lecturer_id)
            ->orderBy('supervision_id', 'desc')
            ->limit(6)
            ->get()
            ->map(function ($item) {

                $studentName = $item->student->name ?? ($item->student->user->name ?? 'Unknown Student');

                return [
                    'leader_name' => $studentName,
                    'activity_title' => $item->activity->title ?? 'Untitled Project',
                    'status' => $item->supervision_status,
                    'assigned_date' => $item -> assigned_date,
                ];
            });
            $activities = $supervisions;
        }
        else if ($user->role_name === 'mahasiswa'){
            $student = $user->student;
            $student_id = $student->student_id;

            $supervisions = Supervision::with([
                'lecturer.user', // Untuk mengambil nama dosen pembimbing
                'activity',      // Untuk mengambil judul aktivitas (title)
            ])
            ->where(function ($query) use ($student_id) {
                $query->where('student_id', $student_id)
                    ->orWhereHas('team.members', function ($q) use ($student_id) {
                        $q->where('student_id', $student_id);
                    });
            })
            ->orderBy('supervision_id', 'desc')
            ->limit(6)
            ->get();

            $activities = $supervisions->map(
                function ($sv) {
                    $lecturerName = $sv->lecturer->name ?? ($sv->lecturer->user->name ?? 'Unknown Lecturer');

                    return [
                        'activity_title' => $sv->activity->title ?? 'Untitled Project',
                        'lecturer_name' => $lecturerName,
                        'assigned_date' => $sv -> assigned_date,
                        'status' => $sv->supervision_status,
                    ];
                }
            );
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
