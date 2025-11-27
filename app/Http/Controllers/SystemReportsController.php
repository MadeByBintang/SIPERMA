<?php

namespace App\Http\Controllers;

use App\Models\Supervision;
use App\Models\Team;
use App\Models\Lecturer;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;


class SystemReportsController extends Controller
{
    public function index()
    {
        $supervisions = Supervision::with(['student.user', 'lecturer.user', 'activity'])->get();
        $teams = Team::with(['leader.student', 'supervisor'])->get();

        $totalProjects = $supervisions->count() + $teams->count();
        $activeSupervisions = $supervisions->filter(fn($s) => in_array(strtolower($s->supervision_status), ['active', 'ongoing', 'approved']))->count();
        $activeTeams = $teams->filter(fn($t) => in_array(strtolower($t->status), ['active', 'ongoing']))->count();
        $totalActive = $activeSupervisions + $activeTeams;

        $completedSupervisions = $supervisions->filter(fn($s) => strtolower($s->supervision_status) === 'completed')->count();
        $completedTeams = $teams->filter(fn($t) => strtolower($t->status) === 'completed')->count();
        $totalCompleted = $completedSupervisions + $completedTeams;

        $totalSupervisors = Lecturer::count();
        $avgStudents = $totalSupervisors > 0 ? round($totalProjects / $totalSupervisors, 1) : 0;

        $distribution = [
            'pkl' => $supervisions->where('activity.activity_type', 'PKL')->count() + $teams->where('type', 'PKL')->count(),
            'thesis' => $supervisions->where('activity.activity_type', 'Thesis')->count(),
            'competition' => $teams->where('type', 'Competition')->count()
        ];

        $stats = [
            'totalProjects' => $totalProjects,
            'activeProjects' => $totalActive,
            'completedProjects' => $totalCompleted,
            'totalSupervisors' => $totalSupervisors,
            'avgStudentsPerSupervisor' => $avgStudents,
        ];

        return Inertia::render('SystemReportsPage', ['stats' => $stats]);
    }

    public function exportPdf()
    {
        $supervisions = Supervision::with(['student.user', 'lecturer.user', 'activity'])->get();
        $teams = Team::with(['leader.student', 'supervisor'])->get();

        $totalProjects = $supervisions->count() + $teams->count();
        $activeSupervisions = $supervisions->filter(fn($s) => in_array(strtolower($s->supervision_status), ['active', 'ongoing', 'approved']))->count();
        $activeTeams = $teams->filter(fn($t) => in_array(strtolower($t->status), ['active', 'ongoing']))->count();
        $totalActive = $activeSupervisions + $activeTeams;

        $completedSupervisions = $supervisions->filter(fn($s) => strtolower($s->supervision_status) === 'completed')->count();
        $completedTeams = $teams->filter(fn($t) => strtolower($t->status) === 'completed')->count();
        $totalCompleted = $completedSupervisions + $completedTeams;

        $totalSupervisors = Lecturer::count();
        $avgStudents = $totalSupervisors > 0 ? round($totalProjects / $totalSupervisors, 1) : 0;

        $distribution = [
            'pkl' => $supervisions->where('activity.activity_type', 'PKL')->count() + $teams->where('type', 'PKL')->count(),
            'thesis' => $supervisions->where('activity.activity_type', 'Thesis')->count(),
            'competition' => $teams->where('type', 'Competition')->count()
        ];

        $stats = compact('totalProjects', 'totalActive', 'totalCompleted', 'totalSupervisors', 'avgStudents', 'distribution');

        $pdf = Pdf::loadView('pdf.reports.admin', ['stats' => $stats]);

        return $pdf->download('system-reports.pdf');
    }
}
