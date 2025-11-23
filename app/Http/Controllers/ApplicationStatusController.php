<?php

namespace App\Http\Controllers;

use App\Models\Supervision;
use App\Models\TeamMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class ApplicationStatusController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $student = $user->student;

        if (!$student) {
            return redirect()->route('dashboard');
        }

        // 1. AMBIL DATA SUBMISSIONS (Pengajuan Bimbingan)
        // Diambil dari tabel 'supervisions' dimana student_id adalah user yang login
        $submissions = Supervision::with(['lecturer.user', 'activity'])
            ->where('student_id', $student->student_id)
            ->orderBy('supervision_id', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => 'sup_' . $item->supervision_id, // ID unik untuk frontend
                    'real_id' => $item->supervision_id,
                    'activityType' => ucfirst($item->activity->activity_type ?? 'Thesis'),
                    'activityName' => $item->activity->title ?? $item->notes ?? 'Untitled Project',
                    'applicationType' => 'submission',
                    'submittedDate' => $item->assigned_date ? Carbon::parse($item->assigned_date)->format('Y-m-d') : now()->format('Y-m-d'),
                    'status' => $this->mapStatus($item->supervision_status),
                    'description' => $item->notes ?? '-',
                    
                    // Data Dosen Pembimbing
                    'supervisorName' => $item->lecturer->user->name ?? $item->lecturer->name ?? '-',
                    'supervisorEmail' => $item->lecturer->user->email ?? '-',
                    
                    // Field lain (opsional/null untuk submission)
                    'companyName' => null,
                    'proposalDocument' => null,
                    'responseDate' => $item->updated_at->format('Y-m-d'), // Asumsi tanggal update adalah tanggal respon
                    'responseNotes' => null, // Tambahkan kolom notes_response di DB jika perlu
                ];
            });

        // 2. AMBIL DATA INVITATIONS (Undangan Tim)
        // Diambil dari tabel 'team_members' dimana student_id adalah user yang login
        // Dan statusnya biasanya 'pending' atau 'invited'
        $invitations = TeamMember::with(['team.leader.student.user', 'team.activity'])
            ->where('student_id', $student->student_id)
            ->orderBy('team_member_id', 'desc')
            ->get()
            ->map(function ($member) {
                $team = $member->team;
                $leader = $team->leader->student->user ?? null;

                return [
                    'id' => 'inv_' . $member->team_member_id,
                    'real_id' => $member->team_member_id,
                    'activityType' => ucfirst($team->type ?? 'Competition'),
                    'activityName' => $team->team_name ?? $team->name,
                    'applicationType' => 'invitation',
                    'submittedDate' => $member->created_at ? $member->created_at->format('Y-m-d') : now()->format('Y-m-d'),
                    'status' => $this->mapStatus($member->member_status ?? $member->status), // Handle nama kolom status
                    
                    'description' => "You have been invited to join team '{$team->team_name}'.",
                    
                    // Data Pengundang
                    'invitedBy' => $leader->name ?? 'Team Leader',
                    'teamLeader' => $leader->name ?? '-',
                    'teamMembers' => [], // Bisa diisi jika perlu list member lain
                    
                    // Field Supervisor (biasanya null untuk undangan tim awal)
                    'supervisorName' => '-',
                    'supervisorEmail' => '-',
                ];
            });

        // Gabungkan kedua collection
        $allApplications = $submissions->concat($invitations);

        return Inertia::render('ApplicationStatusPage', [
            'applications' => $allApplications->values()
        ]);
    }

    public function respond(Request $request, $id)
    {
        // Validasi
        $request->validate([
            'response' => 'required|in:accept,decline'
        ]);

        // Cek apakah ini ID Undangan Tim (inv_...)
        if (str_starts_with($id, 'inv_')) {
            $realId = str_replace('inv_', '', $id);
            $member = TeamMember::findOrFail($realId);

            // Pastikan yang merespon adalah pemilik undangan
            $user = Auth::user();
            if ($member->student_id !== $user->student->student_id) {
                abort(403, 'Unauthorized');
            }

            // Update status
            $newStatus = $request->response === 'accept' ? 'active' : 'rejected';
            
            // Cek nama kolom status di DB (member_status atau status)
            $member->update(['member_status' => $newStatus]); 
            // Jika kolom di DB 'status', ganti jadi: $member->update(['status' => $newStatus]);

            return redirect()->back()->with('success', "Invitation {$request->response}ed successfully.");
        }

        return redirect()->back()->with('error', 'Invalid application ID.');
    }

    // Helper status mapping
    private function mapStatus($status)
    {
        $s = strtolower($status ?? '');
        if (in_array($s, ['active', 'approved', 'accepted'])) return 'approved';
        if (in_array($s, ['rejected', 'declined', 'cancelled'])) return 'rejected';
        return 'pending';
    }
}