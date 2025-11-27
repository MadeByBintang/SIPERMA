<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Team;
use Inertia\Inertia;
use App\Models\Student;
use App\Models\Activity;
use App\Models\Lecturer;
use App\Models\ActivityLog;
use App\Models\Supervision;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TimelineProgressController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $roleName = $user->role_name;

        if ($roleName === 'dosen') {
            return Inertia::render('TimelineProgressPage', [
                'user'          => $user,
                'supervisions' => $this->indexLecture($user->lecturer)
            ]);
        } else if ($roleName === 'mahasiswa') {
            return Inertia::render('TimelineProgressPage', [
                'user'        => $user,
                'supervisions' => $this->indexStudent($user->student)
            ]);
        }
    }

    private function indexLecture(Lecturer $lecturer)
    {
        $supervisions = Supervision::with([
            'student.user',
            'lecturer.user',
            'activity.internship.name',
            'activity.logs',
            'team.members.student.masterStudent',
        ])
            ->where('lecturer_id', $lecturer->lecturer_id)
            ->whereIn('supervision_status', ['approved', 'completed']) 
            ->orderBy('supervision_id', 'desc')
            ->get()
            ->map(function ($item) {

                /* ===== TEAM HANDLING ===== */
                $teamName = null;
                $teamMembers = [];

                if ($item->team) {
                    // Nama tim
                    $teamName = $item->team->team_name ?? '-';

                    // Urutkan leader berdasarkan pivot id
                    $sortedMembers = $item->team->members
                        ->sortBy('pivot.id')
                        ->values();

                    // Konversi ke nama student
                    $teamMembers = $sortedMembers->map(function ($m) {
                        return [
                            'name'  => $m->student->name ?? $m->full_name ?? 'Unknown',
                            'nim'   => $m->student->nim,
                            'email' => $m->student->email ?? '-',
                        ];
                    });
                }

                /* ===== INTERNSHIP COMPANY ===== */
                $companyName = null;
                if ($item->activity->activity_type === 'pkl') {
                    $companyName = $item->activity->internship->company->company_name
                        ?? 'Unknown Company';
                }

                $activityLogs = $item->activity->logs->map(function ($log) {
                    return [
                        'id'          => $log->log_id,
                        'activity_id' => $log->activity_id,
                        'log_date'    => $log->log_date->format('Y-m-d H:i') ?? '-',
                        'description' => $log->progress_note ?? '-',
                    ];
                });

                $latestLog = $item->activity->logs
                    ->sortByDesc('log_date')
                    ->first();

                return [
                    /* ===== SUPERVISION ===== */
                    'id' => $item->supervision_id,
                    'status' => $item->supervision_status === 'approved'
                        ? 'on progress'
                        : ($item->supervision_status ?? 'pending'),

                    'startDate' => $item->activity->start_date
                        ? Carbon::parse($item->activity->start_date)->format('Y-m-d')
                        : "",
                    'endDate' => $item->activity->end_date
                        ? Carbon::parse($item->activity->end_date)->format('Y-m-d')
                        : "",
                    'notes' => $item->notes ?? null,

                    /* ===== LECTURER ===== */
                    'lecturerName' => $item->lecturer->name ?? 'Unknown',
                    'lecturerEmail' => $item->lecturer->email ?? '-',

                    /* ===== ACTIVITY ===== */
                    'activityType' => $item->activity->activityType->type_name ?? '-',
                    'activityName' => $item->activity->title ?? 'Untitled Project',
                    'activityDescription' => $item->activity->description ?? '-',
                    'companyName' => $companyName,

                    /* ===== STUDENT / TEAM ===== */
                    'isTeam' => $item->team_id !== null,
                    'teamName' => $teamName,
                    'teamMembers' => $teamMembers,

                    /* individu */
                    'individualStudentName'  => $item->student->name  ?? null,
                    'individualStudentEmail' => $item->student->email ?? null,
                    'individualStudentNim'   => $item->student->nim ?? null,
                    'individualStudentFocus' => $item->student->focus ?? null,

                    'activityLogs' => $activityLogs,

                    'lastUpdate' => $latestLog
                        ? $latestLog->log_date->format('Y-m-d H:i')
                        : null,

                    /* request type untuk frontend */
                    'requestType' => 'supervision',
                ];
            });

        return $supervisions;
    }

    private function indexStudent(Student $student)
    {
        // Ambil semua supervision: langsung & melalui tim
        $supervisions = Supervision::with([
            'student.user',
            'lecturer.user',
            'activity.internship.company',
            'activity.activityType',
            'activity.logs',
            'team.members.student',
        ])
            ->where(function ($query) use ($student) {
                // Supervision langsung
                $query->where('student_id', $student->student_id)
                    // Supervision via tim
                    ->orWhereHas('team.members', function ($q) use ($student) {
                        $q->where('student_id', $student->student_id);
                    });
            })
            ->whereIn('supervision_status', ['approved', 'completed']) // filter status
            ->orderBy('supervision_id', 'desc')
            ->get();

        // Mapping ke StudentActivity
        $studentActivities = $supervisions->map(function ($sv) use ($student) {

            // Tentukan apakah mahasiswa ini bagian dari tim
            $isTeamMember = $sv->team && $sv->team->members->contains(fn($m) => $m->student_id == $student->student_id);

            // Ambil nama tim & anggota tim jika ada
            $teamName = $sv->team->team_name ?? null;
            $teamMembers = [];
            if ($sv->team) {
                $teamMembers = $sv->team->members->map(fn($m) => [
                    'name' => $m->student->name ?? $m->full_name ?? 'Unknown',
                    'nim' => $m->student->nim,
                    'email' => $m->student->email ?? '-',
                ]);
            }

            // Timeline logs
            $timeline = $sv->activity->logs->map(function ($log) {
                return [
                    'id'          => $log->log_id,
                    'activity_id' => $log->activity_id,
                    'log_date'    => $log->log_date->format('Y-m-d H:i') ?? '-',
                    'description' => $log->progress_note ?? '-',
                ];
            });


            return [
                'id' => $sv->supervision_id,
                'activityType' => $sv->activity->activityType->type_name ?? '-',
                'activityName' => $sv->activity->title ?? 'Untitled Project',
                'supervisor' => $sv->lecturer->name ?? 'Unknown',
                'startDate' => $sv->activity->start_date
                    ? Carbon::parse($sv->activity->start_date)->format('Y-m-d')
                    : "",
                'endDate' => $sv->activity->end_date
                    ? Carbon::parse($sv->activity->end_date)->format('Y-m-d')
                    : "",
                'status' => $sv->supervision_status === 'approved' ? 'on progress' : ($sv->supervision_status ?? 'pending'),
                'timeline' => $timeline,
                'isTeam' => $isTeamMember,
                'teamName' => $teamName,
                'teamMembers' => $teamMembers,

            ];
        });

        return $studentActivities;
    }

    public function updateLog(Request $request)
    {
        /** @var \App\Models\User $user */
        $validated = $request->validate([
            'activity_id' => ['required', 'integer', 'exists:activities,activity_id'],
            'description' => ['required', 'string', 'max:500'],
            'log_date' => ['nullable', 'date'],
        ]);

        try {
            $activity = Activity::findOrFail($validated['activity_id']);

            // 3. Buat Activity Log Baru
            $log = ActivityLog::create([
                'activity_id' => $validated['activity_id'],
                'progress_note' => $validated['description'],
                'log_date' => $validated['log_date'] ?? Carbon::now()->toDateString(),
            ]);

            $activity->updated_at = Carbon::now();
            $activity->save();

            return back()->with('success', 'Progress log has been added successfully!');
        } catch (\Exception $e) {
            Log::error('Failed to store activity log: ' . $e->getMessage());

            // Response error
            return back()->withErrors(['submission' => 'Failed to save progress due to a server error.']);
        }
    }

    public function completeActivity(Request $request, String $activity_id)
    {
        $activity = Activity::findOrFail($activity_id);

        if ($activity->lecturer_id !== Auth::user()->lecturer->lecture_id) {
            abort(403, 'Anda tidak memiliki otorisasi untuk menyelesaikan aktivitas ini.');
        }

        $supervisions = Supervision::where('activity_id', $activity->activity_id)->firstOrFail();

        $supervisions->supervision_status = 'completed';
        $supervisions->save();

        return back()->with('success', 'Activity berhasil ditandai sebagai Selesai.');
    }
}
