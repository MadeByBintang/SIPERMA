<?php

namespace App\Http\Controllers;

use App\Models\Supervision;
use App\Models\Team;
use App\Models\Lecturer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportsController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $role = $user->role_name; // Asumsi kolom role bernama role_name

        // --- 1. SIAPKAN QUERY (BELUM DI-GET) ---
        $supervisionQuery = Supervision::with(['student.user', 'lecturer.user', 'activity']);
        $teamQuery = Team::with(['leader.student.user', 'supervisor.user']);

        // --- 2. TERAPKAN FILTER SESUAI ROLE (PERINTAH PM) ---
        if ($role === 'student') {
            // Mahasiswa: Hanya melihat aktivitas miliknya sendiri
            // Asumsi: User punya relasi 'student'
            $studentId = $user->student->id ?? 0;

            $supervisionQuery->where('student_id', $studentId);
            // Untuk tim, cek apakah dia leader (bisa ditambahkan logic member jika ada tabel pivot)
            $teamQuery->whereHas('leader', function ($q) use ($studentId) {
                $q->where('student_id', $studentId);
            });
        } elseif ($role === 'lecturer') {
            // Dosen: Hanya melihat mahasiswa yang dibimbingnya
            // Asumsi: User punya relasi 'lecturer'
            $lecturerId = $user->lecturer->id ?? 0;

            $supervisionQuery->where('lecturer_id', $lecturerId);
            $teamQuery->where('supervisor_id', $lecturerId);
        }
        // Admin: Tidak ada filter (melihat semua)

        // --- 3. EKSEKUSI QUERY & MAPPING DATA ---

        // Data Supervisi (Thesis/PKL Individu)
        $supervisions = $supervisionQuery->get()->map(function ($s) {
            return [
                'id' => 'sup_' . $s->supervision_id,
                'studentName' => $s->student->user->name ?? $s->student->name ?? 'Unknown',
                'studentNIM' => $s->student->nim ?? '-',
                'activityType' => ucfirst($s->activity->activity_type ?? 'Thesis'),
                'activityName' => $s->activity->title ?? $s->notes ?? 'Untitled',
                'supervisorName' => $s->lecturer->user->name ?? $s->lecturer->name ?? '-',
                'teamMembers' => [$s->student->name ?? 'Student'],
                'startDate' => $s->assigned_date ? Carbon::parse($s->assigned_date)->format('Y-m-d') : null,
                'endDate' => $s->end_date,
                'status' => $this->mapStatus($s->supervision_status),
                'progress' => (int) ($s->progress_percentage ?? 0),
                'created_at' => $s->created_at ?? $s->assigned_date,
            ];
        });

        // Data Tim (Competition/PKL Tim)
        $teams = $teamQuery->get()->map(function ($t) {
            $leaderName = $t->leader->student->user->name ?? $t->leader->student->name ?? 'Leader';
            return [
                'id' => 'team_' . $t->team_id,
                'studentName' => $leaderName,
                'studentNIM' => $t->leader->student->nim ?? '-',
                'activityType' => ucfirst($t->type ?? 'Competition'),
                'activityName' => $t->team_name ?? $t->name,
                'supervisorName' => $t->supervisor->user->name ?? $t->supervisor->name ?? '-',
                'teamMembers' => [$leaderName, '...'],
                'startDate' => $t->created_at ? $t->created_at->format('Y-m-d') : null,
                'endDate' => $t->competition_date,
                'status' => $this->mapStatus($t->status),
                'progress' => (int) ($t->progress ?? 0),
                'created_at' => $t->created_at,
            ];
        });

        // Gabungkan Data
        $allActivities = $supervisions->concat($teams);

        // --- 4. HITUNG STATISTIK DARI DATA YANG SUDAH DI-FILTER ---
        // Stats ini sekarang spesifik user (misal: total project mahasiswa A saja)
        $totalProjects = $allActivities->count();
        $activeProjects = $allActivities->filter(fn($a) => in_array($a['status'], ['In Progress', 'On Progress', 'Active']))->count();
        $completedProjects = $allActivities->filter(fn($a) => $a['status'] === 'Completed')->count();

        $totalSupervisors = Lecturer::count(); // Ini tetap global context
        $avgStudentsPerSupervisor = $totalSupervisors > 0 ? round($totalProjects / $totalSupervisors, 1) : 0;
        $engagementRate = $totalProjects > 0 ? round(($activeProjects / $totalProjects) * 100) : 0;

        return Inertia::render('ReportPage', [
            'activities' => $allActivities->values(),
            'userRole' => $role,
            'stats' => [
                'totalProjects' => $totalProjects,
                'activeProjects' => $activeProjects,
                'completedProjects' => $completedProjects,
                'totalSupervisors' => $totalSupervisors,
                'avgStudentsPerSupervisor' => $avgStudentsPerSupervisor,
                'engagementRate' => $engagementRate,
                'departments' => 4,
            ]
        ]);
    }

    private function mapStatus($status)
    {
        $s = strtolower($status ?? '');
        if (in_array($s, ['approved', 'active', 'ongoing', 'in progress'])) return 'In Progress';
        if (in_array($s, ['completed', 'finished'])) return 'Completed';
        if (in_array($s, ['proposal', 'pending'])) return 'Proposal';
        if (in_array($s, ['revision'])) return 'Revision';
        return 'Unknown';
    }

    public function exportPdf(Request $request)
    {
        $user = Auth::user();
        $role = $user->role_name;

        // FILTER dari frontend
        $activityType = $request->activityType ?? 'all';
        $statusFilter = $request->statusFilter ?? 'all';
        $dateRange = $request->dateRange ?? 'all';

        // -----------------------------------------------------
        // 1. ROLE BASE QUERY
        // -----------------------------------------------------
        $supervisionQuery = Supervision::with(['student.user', 'lecturer.user', 'activity']);
        $teamQuery = Team::with(['leader.student.user', 'supervisor.user']);

        if ($role === 'mahasiswa') {
            $studentId = $user->student->id ?? 0;

            $supervisionQuery->where('student_id', $studentId);
            $teamQuery->whereHas(
                'leader',
                fn($q) =>
                $q->where('student_id', $studentId)
            );
        } elseif ($role === 'dosen') {
            $lecturerId = $user->lecturer->id ?? 0;

            $supervisionQuery->where('lecturer_id', $lecturerId);
            $teamQuery->where('supervisor_id', $lecturerId);
        }

        // -----------------------------------------------------
        // 2. FILTER ACTIVITY TYPE
        // -----------------------------------------------------
        if ($activityType !== 'all') {
            $supervisionQuery->whereHas('activity', function ($q) use ($activityType) {
                $q->where('activity_type', $activityType);
            });

            $teamQuery->where('type', $activityType);
        }

        // -----------------------------------------------------
        // 3. FILTER STATUS
        // -----------------------------------------------------
        if ($statusFilter !== 'all') {
            $supervisionQuery->where('supervision_status', $statusFilter);
            $teamQuery->where('status', $statusFilter);
        }

        // -----------------------------------------------------
        // 4. FILTER DATE RANGE (BERBEDA UNTUK SUPERVISIONS)
        // -----------------------------------------------------
        if ($dateRange === 'month') {

            // **supervisions: pakai assigned_date**
            $supervisionQuery->whereMonth('assigned_date', now()->month);

            // teams: created_at normal
            $teamQuery->whereMonth('created_at', now()->month);
        } elseif ($dateRange === 'year') {

            $supervisionQuery->whereYear('assigned_date', now()->year);
            $teamQuery->whereYear('created_at', now()->year);
        }

        // -----------------------------------------------------
        // 5. MAP DATA
        // -----------------------------------------------------
        $supervisions = $supervisionQuery->get()->map(function ($s) {
            return [
                'student' => $s->student->user->name ?? '-',
                'supervisor' => $s->lecturer->user->name ?? '-',
                'activityType' => ucfirst($s->activity->activity_type),
                'activityName' => $s->activity->title ?? 'No Title',
                'status' => $s->supervision_status,
                'startDate' => $s->assigned_date,
                'endDate' => $s->end_date ?? '-',
            ];
        });

        $teams = $teamQuery->get()->map(function ($t) {
            return [
                'student' => $t->leader->student->user->name ?? '-',
                'supervisor' => $t->supervisor->user->name ?? '-',
                'activityType' => ucfirst($t->type),
                'activityName' => $t->team_name,
                'status' => $t->status,
                'startDate' => $t->created_at->format('Y-m-d'),
                'endDate' => $t->competition_date ?? '-',
            ];
        });

        $activities = $supervisions->concat($teams);

        // -----------------------------------------------------
        // 6. VIEW PDF BERDASARKAN ROLE
        // -----------------------------------------------------
        $view = match ($role) {
            'dosen' => 'pdf.reports.lecturer',
            'mahasiswa' => 'pdf.reports.student',
            default => 'pdf.reports.admin'
        };

        // -----------------------------------------------------
        // 7. GENERATE PDF
        // -----------------------------------------------------
        $pdf = Pdf::loadView($view, [
            'user' => $user,
            'role' => $role,
            'activities' => $activities,
            'filters' => [
                'activityType' => $activityType,
                'statusFilter' => $statusFilter,
                'dateRange' => $dateRange
            ]
        ])->setPaper('a4', 'portrait');

        return $pdf->stream("report-$role.pdf");
    }
}
