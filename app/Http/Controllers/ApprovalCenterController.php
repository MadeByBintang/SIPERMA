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
    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $approvalRequests = collect();

        if ($user->role_name === 'lecturer' && $user->lecturer) {
            $approvalRequests = Supervision::with(['student.user', 'activity'])
                ->where('lecturer_id', $user->lecturer->lecturer_id)
                ->orderBy('supervision_id', 'desc')
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->supervision_id,
                        'studentName' => $item->student->user->name ?? $item->student->name ?? 'Unknown',
                        'studentNIM' => $item->student->nim ?? '-',
                        'studentEmail' => $item->student->user->email ?? '-',
                        // GPA SUDAH DIHAPUS
                        'studentInterest' => $item->student->interest_field ?? 'General',
                        'activityType' => ucfirst($item->activity->activity_type ?? 'Activity'),
                        'activityName' => $item->activity->title ?? 'Untitled Project',
                        'companyName' => null,
                        'requestType' => 'supervision',
                        'submittedDate' => $item->assigned_date ? Carbon::parse($item->assigned_date)->format('Y-m-d') : now()->format('Y-m-d'),
                        'status' => strtolower($item->supervision_status ?? 'pending'),
                        'description' => $item->notes ?? 'No description provided.',
                        'notes' => null,
                        'proposalDocument' => null,
                    ];
                });
        }

        return Inertia::render('ApprovalPage', [
            'approvalRequests' => $approvalRequests
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
        if ($user->role_name === 'lecturer' && $user->lecturer->lecturer_id !== $supervision->lecturer_id) {
            abort(403, 'Unauthorized');
        }

        $status = $request->action === 'approve' ? 'active' : 'rejected';

        // 1. Update Status Supervisi
        $supervision->update([
            'supervision_status' => $status,
        ]);

        // 2. [BARU] Simpan Log Aktivitas (Menggunakan activity_id)
        if ($supervision->activity_id) {
            ActivityLog::create([
                'activity_id' => $supervision->activity_id, // <--- KOLOM BARU
                'user_id' => $user->id,                     // ID Dosen
                'action_type' => ucfirst($status),          // Approved / Rejected
                'progress_note' => $request->notes ?? "Supervision request was {$status} by lecturer.",
                'log_date' => now(),
            ]);
        }

        return redirect()->back()->with('success', "Request successfully {$status}.");
    }
}