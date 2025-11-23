<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Supervision;
use App\Models\Team;
use App\Models\ActivityLog;
use Carbon\Carbon;

class TimelineProgressController extends Controller
{
    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $roleName = $user->role_name; 
        
        $activities = [];
        $supervisedStudents = [];

        if ($roleName === 'student' && $user->student) {
            $activities = $this->getStudentActivities($user->student);
        } elseif ($roleName === 'lecturer' && $user->lecturer) {
            $supervisedStudents = $this->getSupervisedStudents($user->lecturer);
        }

        return Inertia::render('TimelineProgressPage', [
            'userRole' => $roleName,
            'studentActivities' => $activities, 
            'supervisedStudents' => $supervisedStudents,
        ]);
    }

    private function getStudentActivities($student)
    {
        $list = collect();

        // 1. AMBIL DARI SUPERVISION (Thesis/PKL Individu)
        // Eager load 'activity.logs' agar efisien
        $supervisions = Supervision::with(['lecturer.user', 'activity.logs'])
            ->where('student_id', $student->student_id)
            ->get();

        foreach ($supervisions as $s) {
            $list->push([
                'id' => 'sup_' . $s->supervision_id,
                'activityType' => ucfirst($s->activity->activity_type ?? 'Thesis'),
                'activityName' => $s->activity->title ?? $s->notes ?? 'Untitled Project',
                'supervisor' => $s->lecturer->user->name ?? $s->lecturer->name ?? '-',
                'startDate' => $s->assigned_date ? Carbon::parse($s->assigned_date)->format('Y-m-d') : null,
                'endDate' => $s->end_date,
                'status' => $this->mapStatus($s->supervision_status),
                'overallProgress' => (int) ($s->progress_percentage ?? 0),
                // PERBAIKAN: Ambil Log dari Database
                'timeline' => $this->formatLogs($s->activity),
            ]);
        }

        // 2. AMBIL DARI TEAM (Competition/PKL Tim)
        $teams = Team::with(['supervisor.user', 'activity.logs'])
            ->whereHas('members', function($q) use ($student) {
                $q->where('student_id', $student->student_id);
            })
            ->get();

        foreach ($teams as $t) {
            $list->push([
                'id' => 'team_' . $t->team_id,
                'activityType' => ucfirst($t->type ?? 'Competition'),
                'activityName' => $t->team_name ?? $t->name,
                'supervisor' => $t->supervisor->user->name ?? $t->supervisor->name ?? '-',
                'startDate' => $t->created_at ? $t->created_at->format('Y-m-d') : null,
                'endDate' => $t->competition_date,
                'status' => $this->mapStatus($t->status),
                'overallProgress' => (int) ($t->progress ?? 0),
                // PERBAIKAN: Ambil Log dari Database
                'timeline' => $this->formatLogs($t->activity),
            ]);
        }

        return $list;
    }

    private function getSupervisedStudents($lecturer)
    {
        // Supervision (Thesis/PKL)
        $supervisions = Supervision::with(['student.user', 'activity.logs'])
            ->where('lecturer_id', $lecturer->lecturer_id)
            ->get()
            ->map(function ($s) {
                 return [
                    'id' => 'sup_' . $s->supervision_id,
                    'studentName' => $s->student->user->name ?? $s->student->name,
                    'studentNIM' => $s->student->nim,
                    'activityType' => ucfirst($s->activity->activity_type ?? 'Thesis'),
                    'activityName' => $s->activity->title ?? $s->notes ?? 'Untitled',
                    'overallProgress' => (int) ($s->progress_percentage ?? 0),
                    'currentPhase' => 'Research', 
                    'status' => $this->mapStatus($s->supervision_status),
                    'lastUpdate' => now()->format('Y-m-d'),
                    'timeline' => $this->formatLogs($s->activity),
                ];
            });

        // Teams (Competition)
        $teams = Team::with(['leader.student.user', 'members', 'activity.logs'])
            ->where('supervisor_id', $lecturer->lecturer_id)
            ->get()
            ->map(function ($t) {
                 return [
                    'id' => 'team_' . $t->team_id,
                    'studentName' => $t->leader->student->user->name ?? 'Team Leader',
                    'studentNIM' => $t->leader->student->nim ?? '-',
                    'activityType' => ucfirst($t->type ?? 'Competition'),
                    'activityName' => $t->team_name ?? $t->name,
                    'overallProgress' => (int) ($t->progress ?? 0),
                    'currentPhase' => 'Execution',
                    'status' => $this->mapStatus($t->status),
                    'lastUpdate' => $t->updated_at ? $t->updated_at->format('Y-m-d') : now()->format('Y-m-d'),
                    'timeline' => $this->formatLogs($t->activity),
                ];
            });

        return $supervisions->concat($teams)->values();
    }

    // Helper Baru: Format Log dari Database untuk Frontend
    private function formatLogs($activity)
    {
        if (!$activity || !$activity->logs || $activity->logs->isEmpty()) {
            return [];
        }

        return $activity->logs
            ->sortByDesc('log_date') // Urutkan dari terbaru
            ->values()
            ->map(function($log, $index) {
                return [
                    'id' => $log->log_id,
                    'title' => ucfirst($log->action_type ?? 'Update'),
                    'status' => 'completed', // Asumsi semua log yang tersimpan sudah terjadi
                    'date' => $log->log_date ? Carbon::parse($log->log_date)->format('Y-m-d') : '-',
                    'description' => $log->progress_note,
                ];
            })
            ->toArray();
    }

    public function updateLog(Request $request)
{
    /** @var \App\Models\User $user */
    $user = Auth::user();
    
    // 1. Validasi Input
    $request->validate([
        'activity_id' => 'required|integer', // ID Activity yang menjadi induk log
        'status' => 'required|in:pending,in-progress,completed',
        'progress_note' => 'required|string|max:1000',
    ]);

    // 2. Simpan Log Baru
    ActivityLog::create([
        'activity_id' => $request->activity_id,
        'user_id' => $user->id,
        'log_date' => now(),
        'progress_note' => $request->progress_note,
        'action_type' => 'Progress Update', 
        'status_after' => $request->status, // Menyimpan status saat log ini dibuat
    ]);

    // Opsional: Update progress_percentage di tabel Activity/Supervision induk
    // Asumsi: Anda bisa mendapatkan Supervision ID dari Activity ID
    // Contoh: Activity::find($request->activity_id)->supervision->update(['progress_percentage' => $request->progress_percentage]);

    return redirect()->back()->with('success', 'Progress log recorded successfully!');
}

    private function mapStatus($status)
    {
        $s = strtolower($status ?? '');
        if (in_array($s, ['approved', 'active', 'ongoing', 'in progress'])) return 'In Progress';
        if (in_array($s, ['completed', 'finished'])) return 'Completed';
        return 'Pending';
    }
}