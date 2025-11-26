<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\TeamMember; // Tambahkan ini
use App\Models\Supervision;
use App\Models\Activity;   // Tambahkan ini
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB; // Tambahkan ini
use Inertia\Inertia;
use Carbon\Carbon;

class RelationManagementController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $lecturerId = $user->lecturer->lecturer_id ?? null;
        $studentId = $user->student->student_id ?? null;

        // --- 1. DATA TIM (PKL & LOMBA) ---
        $studentStudentRelations = collect();

        // Query dasar untuk Team
        $teamQuery = Team::with(['members.student.user', 'supervisor.user', 'leader.student.user']);

        // Filter berdasarkan Role
        if ($studentId) {
            $teamQuery->whereHas('members', function ($q) use ($studentId) {
                $q->where('student_id', $studentId);
            });
        } elseif ($lecturerId) {
        }

        $studentStudentRelations = $teamQuery->orderBy('team_id', 'desc')
            ->get()
            ->map(function ($team) {
                $members = $team->members->map(function ($member) {
                    return [
                        'name' => $member->student->user->name ?? $member->student->name ?? 'Unknown',
                        'nim' => $member->student->nim ?? '-',
                        'role' => $member->role_in_team ?? 'Member',
                    ];
                });

                if ($team->leader && !$members->contains('nim', $team->leader->student->nim)) {
                    $members->prepend([
                        'name' => $team->leader->student->user->name ?? $team->leader->student->name,
                        'nim' => $team->leader->student->nim,
                        'role' => 'Team Leader',
                    ]);
                }

                return [
                    'id' => 'team_' . $team->team_id, // Prefix ID
                    'real_id' => $team->team_id,
                    'activityType' => ucfirst($team->type ?? 'Competition'),
                    'activityName' => $team->team_name ?? $team->name,
                    'teamMembers' => $members->toArray(),
                    'supervisorName' => $team->supervisor->user->name ?? $team->supervisor->name ?? 'Belum Ada Pembimbing',
                    'supervisorNIP' => $team->supervisor->nip ?? '-',
                    'startDate' => $team->created_at ? Carbon::parse($team->created_at)->format('Y-m-d') : now()->format('Y-m-d'),
                    'endDate' => $team->competition_date ?? $team->end_date,
                    'status' => $this->mapStatus($team->status),
                    'location' => $team->location ?? 'Kampus',
                    'description' => $team->description ?? '-',

                    // Data ID untuk Edit (Raw)
                    'leader_id' => $team->leader_id,
                ];
            });

        // --- 2. DATA SKRIPSI (Supervision) ---
        $studentLecturerRelations = collect();
        $supervisionQuery = Supervision::with(['student.user', 'lecturer.user', 'activity']);

        if ($studentId) {
            $supervisionQuery->where('student_id', $studentId);
        } elseif ($lecturerId) {
            $supervisionQuery->where('lecturer_id', $lecturerId);
        }

        $studentLecturerRelations = $supervisionQuery
            ->orderBy('supervision_id', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => 'sup_' . $item->supervision_id,
                    'real_id' => $item->supervision_id,
                    'activityType' => ucfirst($item->activity->activity_type ?? 'Thesis'),
                    'thesisTitle' => $item->activity->title ?? $item->notes ?? 'Untitled',
                    'studentName' => $item->student->user->name ?? $item->student->name ?? '-',
                    'studentNIM' => $item->student->nim ?? '-',
                    'supervisorName' => $item->lecturer->user->name ?? $item->lecturer->name ?? '-',
                    'supervisorNIP' => $item->lecturer->nip ?? '-',
                    'startDate' => $item->assigned_date ? Carbon::parse($item->assigned_date)->format('Y-m-d') : null,
                    'status' => $this->mapStatus($item->supervision_status),
                    'description' => $item->notes ?? '-',

                    // Data ID untuk Edit
                    'student_id' => $item->student_id,
                    'lecturer_id' => $item->lecturer_id,
                ];
            });

        // [PENTING] Ambil List untuk Dropdown Create
        $studentsList = \App\Models\Student::with('user')->get()->map(fn($s) => [
            'id' => $s->student_id,
            'name' => $s->user->name ?? $s->name,
            'nim' => $s->nim
        ]);

        $lecturersList = \App\Models\Lecturer::with('user')->get()->map(fn($l) => [
            'id' => $l->lecturer_id,
            'name' => $l->user->name ?? $l->name
        ]);

        return Inertia::render('RelationManagementPage', [
            'studentStudentRelations' => $studentStudentRelations,
            'studentLecturerRelations' => $studentLecturerRelations,
            // Kirim list untuk dropdown
            'studentsList' => $studentsList,
            'lecturersList' => $lecturersList,
        ]);
    }

    // --- CREATE (STORE) ---
    public function store(Request $request)
    {
        $request->validate([
            'relationType' => 'required|in:student-lecturer,student-student',
            'title' => 'required|string|max:255',
            'activity_type' => 'required|string',
            'student_id' => 'required|exists:students,student_id', // Leader/Mahasiswa
            'lecturer_id' => 'nullable|exists:lecturers,lecturer_id', // Supervisor
        ]);

        DB::transaction(function () use ($request) {
            // 1. Create Activity
            $activity = Activity::create([
                'activity_type_id' => $this->getTypeId($request->activity_type),
                'title' => $request->title,
                'description' => 'Created via Relations Manager',
                'start_date' => now(),
            ]);

            if ($request->relationType === 'student-lecturer') {
                // Create Supervision
                Supervision::create([
                    'student_id' => $request->student_id,
                    'lecturer_id' => $request->lecturer_id, // Wajib ada
                    'activity_id' => $activity->activity_id,
                    'supervision_status' => 'active',
                    'assigned_date' => now(),
                    'notes' => 'Manual creation',
                ]);
            } else {
                // Create Team
                $team = Team::create([
                    'name' => $request->title,
                    'type' => $request->activity_type,
                    'leader_id' => \App\Models\Student::find($request->student_id)->user_id,
                    'activity_id' => $activity->activity_id,
                    'status' => 'active',
                ]);

                // Add Leader as Member
                TeamMember::create([
                    'team_id' => $team->team_id,
                    'student_id' => $request->student_id,
                    'role_in_team' => 'Leader',
                    'member_status' => 'active',
                ]);
            }
        });

        return redirect()->back()->with('success', 'Relation created successfully');
    }

    // --- UPDATE ---
    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string',
            'title' => 'nullable|string',
        ]);

        DB::transaction(function () use ($request, $id) {
            if (str_starts_with($id, 'sup_')) {
                $realId = str_replace('sup_', '', $id);
                $supervision = Supervision::findOrFail($realId);
                $supervision->update(['supervision_status' => $request->status]);

                if ($request->title && $supervision->activity) {
                    $supervision->activity->update(['title' => $request->title]);
                }
            } elseif (str_starts_with($id, 'team_')) {
                $realId = str_replace('team_', '', $id);
                $team = Team::findOrFail($realId);
                $team->update(['status' => $request->status]);

                if ($request->title) {
                    $team->update(['name' => $request->title]);
                    if ($team->activity) $team->activity->update(['title' => $request->title]);
                }
            }
        });

        return redirect()->back()->with('success', 'Relation updated successfully');
    }

    // --- DELETE ---
    public function destroy($id)
    {
        DB::transaction(function () use ($id) {
            if (str_starts_with($id, 'sup_')) {
                $realId = str_replace('sup_', '', $id);
                $supervision = Supervision::findOrFail($realId);
                if ($supervision->activity) $supervision->activity->delete();
                $supervision->delete();
            } elseif (str_starts_with($id, 'team_')) {
                $realId = str_replace('team_', '', $id);
                $team = Team::findOrFail($realId);
                $team->members()->delete();
                if ($team->activity) $team->activity->delete();
                $team->delete();
            }
        });

        return redirect()->back()->with('success', 'Relation deleted successfully');
    }

    private function mapStatus($status)
    {
        $s = strtolower($status ?? '');
        if (in_array($s, ['active', 'approved', 'ongoing'])) return 'active';
        if (in_array($s, ['pending', 'proposal'])) return 'pending';
        if (in_array($s, ['completed', 'finished'])) return 'completed';
        return 'rejected';
    }

    private function getTypeId($typeString)
    {
        $s = strtolower($typeString);
        if (str_contains($s, 'thesis')) return 1;
        if (str_contains($s, 'pkl')) return 2;
        return 3; // Competition
    }
}
