<?php

namespace App\Http\Controllers;

use App\Models\Supervision;
use App\Models\ActivityLog; // JANGAN LUPA IMPORT MODEL INI
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class ApprovalCenterController extends Controller
{

    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();


        $lecturerId = $user->lecturer->lecturer_id;

        // Ambil semua supervision + relasi yang dibutuhkan
        $supervisions = Supervision::with([
            'student.user',              // mahasiswa pengaju individu (kalau ada)
            'lecturer.user',             // dosen pembimbing
            'activity.internship', // untuk ambil tempat magang PKL
            'team.members.student.masterStudent',         // anggota tim + data user
        ])
            ->where('lecturer_id', $lecturerId)
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
                if ($item->activity->activity_type_id === 2) {
                    $companyName = $item->activity->internship->name
                        ?? 'Unknown Company';
                }

                return [
                    /* ===== SUPERVISION ===== */
                    'id' => $item->supervision_id,
                    'status' => $item->supervision_status,
                    'submittedDate' => $item->assigned_at
                        ? Carbon::parse($item->assigned_at)->format('Y-m-d')
                        : now()->format('Y-m-d'),
                    'notes' => $item->notes ?? null,

                    /* ===== LECTURER ===== */
                    'lecturerName' => $item->lecturer->name ?? 'Unknown',
                    'lecturerEmail' => $item->lecturer->email ?? '-',
                    'current_supervision'   => $item -> lecturer -> supervisions
                                        ->where('supervision_status', 'approved')
                                        ->count(),
                    'supervision_quota'     => $item -> lecturer -> supervision_quota,

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

                    /* request type untuk frontend */
                    // 'requestType' => 'supervision',
                ];
            });

        return Inertia::render('ApprovalPage', [
            'approvalRequests' => $supervisions
        ]);
    }


    // Handle Approve/Reject
    public function update(Request $request, $id)
    {
        $request->validate([
            'action' => 'required|in:approve,reject',
            'notes' => 'nullable|string'
        ]);

        $supervision = Supervision::findOrFail($id);

        $user = Auth::user();
        if ($user->role_name === 'dosen' && $user->lecturer->lecturer_id !== $supervision->lecturer_id) {
            abort(403, 'Unauthorized');
        }

        $status = $request->action === 'approve' ? 'approved' : 'rejected';

        $supervision->update([
            'supervision_status' => $status,
            'notes'             => $request->notes
        ]);

        if ($supervision->activity_id && $status == 'approved') {
            ActivityLog::create([
                'activity_id' => $supervision->activity_id,
                'progress_note' => "Supervision request was {$status} by lecturer.",
                'log_date' => now(),
            ]);
        }

        return redirect()->back()->with('success', "Request successfully {$status}.");
    }
}
