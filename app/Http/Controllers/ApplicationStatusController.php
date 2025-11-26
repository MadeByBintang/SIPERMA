<?php

namespace App\Http\Controllers;

use App\Models\Supervision;
use App\Models\Team; 
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

        $studentId = $student->student_id;
        
        // 1. Ambil Semua Pendaftaran (Submission/Thesis) dari tabel supervisions
        $supervisions = Supervision::with([
            'lecturer.user', 
            'activity.internship',
            'activity.activityType', 
            'team.members.student.user',
            'team.leader.user' // Ambil leader untuk tahu siapa yang mengajukan (pencatat record supervisi)
        ])
        ->where('student_id', $studentId) 
        ->orderBy('supervision_id', 'desc')
        ->get();

        // 2. Ambil tim yang diajukan oleh mahasiswa (dia sebagai leader)
        $teamSubmissions = Team::with([
            'leader',
            'supervisor.user',
            'activity.internship',
            'activity.activityType',
            'members.student.user',
        ])
        ->where('leader_id', $user->user_id)
        ->orderBy('team_id', 'desc')
        ->get();

        // 3. Ambil Semua Status Keanggotaan/Undangan dari team_members
        $invitations = TeamMember::with([
            'team.leader.user',
            'team.supervisor.user',
            'team.activity.activityType',
            'team.activity.internship',
            'team.members.student.user',
        ])
        ->where('student_id', $studentId)
        // ->where('member_status', 'pending') // Hanya ambil undangan yang menunggu respons
        ->get();

        
        $applications = collect();

        // A. Format Submissions (Pengajuan Dosen - Skripsi atau Tim)
        $supervisions->each(function ($item) use (&$applications) {
            $activity = $item->activity;
            $team = $item->team;

            $teamMembersNames = [];
            if ($team) {
                $teamMembersNames = $team->members->map(function($m) {
                    return $m->student->user->name ?? $m->student->name;
                })->values()->toArray();
            }

            $applications->push([
                'id' => 'sup_' . $item->supervision_id, 
                'real_id' => $item->supervision_id,
                'applicationType' => $team ? 'Team Submission' : 'Thesis Submission', 
                
                // Activity Info
                'activityType' => ucfirst($activity->activityType->type_name ?? 'Thesis'),
                'activityName' => $activity->title ?? 'Untitled Project',
                'description' => $activity->description ?? $item->notes ?? '-',
                
                // Status & Dates
                'status' => $this->mapStatus($item->supervision_status),
                'submittedDate' => $item->assigned_date ? Carbon::parse($item->assigned_date)->format('d M Y') : '-',
                
                // Supervisor Info
                'supervisorName' => $item->lecturer->user->name ?? $item->lecturer->name ?? '-',
                // 'supervisorEmail' => $item->lecturer->user->email ?? '-', // Dihapus karena tidak ada di return asli Anda
                
                // Team/Company Info
                'isTeam' => $team !== null,
                'companyName' => $activity->internship->name ?? null, 
                'teamMembers' => $teamMembersNames, 
                'responseNotes' => $item->notes ?? '-',
                'invitedBy' => $team ? ($team->leader->user->name ?? $team->leader->name) : null, // Siapa yang mengajukan
            ]);
        });
        
        // B. Format Team Submissions (yang diajukan oleh user)
        $teamSubmissions->each(function ($team) use (&$applications) {
            // Hindari duplikasi jika logic supervisi nanti ditambahkan untuk leader
            if ($applications->contains('id', 'team_' . $team->team_id)) {
                return;
            }

            $activity = $team->activity;
            $teamMembersNames = $team->members->map(function($m) {
                return $m->student->user->name ?? $m->student->name;
            })->values()->toArray();

            $applications->push([
                'id' => 'team_' . $team->team_id,
                'real_id' => $team->team_id,
                'applicationType' => 'Team Submission',
                
                'activityType' => ucfirst($activity->activityType->type_name ?? 'Team Activity'),
                'activityName' => $team->team_name ?? 'Untitled Team',
                'description' => $activity->description ?? '-',
                
                'status' => $this->mapStatus($team->status),
                'submittedDate' => $team->created_at ? Carbon::parse($team->created_at)->format('d M Y') : '-',
                
                'supervisorName' => $team->supervisor->user->name ?? $team->supervisor->name ?? '-',
                
                'isTeam' => true,
                'companyName' => $activity->internship->name ?? null,
                'teamMembers' => $teamMembersNames,
                'responseNotes' => $team->description ?? '-',
                'invitedBy' => data_get($team, 'leader.student.user.name'),
            ]);
        });

        // C. Format Invitations (Undangan Tim - Untuk Anggota)
        $invitations->each(function ($item) use (&$applications) {
            $team = $item->team;
            // Hindari menampilkan status tim yang dia lead sendiri sebagai "undangan"
            if ($team->leader_id === Auth::id()) {
                return;
            }
            // Hindari duplikasi jika sudah ada di list submission
            if ($applications->contains('id', 'sup_' . $item->team_member_id)) { // asumsi ID unik
                return;
            }

            $activity = $team->activity;
            
            $teamMembersNames = $team->members->map(function($m) {
                return $m->student->user->name ?? $m->student->name;
            })->values()->toArray();

            // Status yang ditampilkan adalah status keanggotaan tim (pending)
            $applications->push([
                'id' => 'inv_' . $item->team_member_id, 
                'real_id' => $item->team_member_id,
                'applicationType' => 'Invitation', 
                
                // Activity Info
                'activityType' => ucfirst($activity->activityType->type_name ?? 'Team Activity'),
                'activityName' => $team->team_name ?? 'Untitled Team',
                'description' => $activity->description ?? '-',
                
                // Status & Dates
                'status' => $this->mapStatus($item->member_status), 
                'submittedDate' => $item->created_at ? Carbon::parse($item->created_at)->format('d M Y') : '-',
                
                // Supervisor Info
                'supervisorName' => $team->supervisor->user->name ?? $team->supervisor->name ?? '-',
                // 'supervisorEmail' => $team->supervisor->user->email ?? '-', // Dihapus karena tidak ada di return asli Anda
                
                // Team/Company Info
                'isTeam' => true,
                'companyName' => $activity->internship->name ?? null, 
                'teamMembers' => $teamMembersNames, 
                'responseNotes' => '-',
                'invitedBy' => data_get($team, 'leader.student.user.name'), // Ketua tim
            ]);
        });

        // Urutkan dan pastikan hasilnya adalah array
        $sortedApplications = $applications->unique('id')->sortByDesc('submittedDate'); 

        return Inertia::render('ApplicationStatusPage', [
            'applications' => $sortedApplications->values() 
        ]);
    }
    
    public function respond(Request $request, $id)
    {
    
        $request->validate(['response' => 'required|in:accept,decline']);

        if (str_starts_with($id, 'inv_')) {
            $realId = str_replace('inv_', '', $id);
            $member = TeamMember::findOrFail($realId);
            
            if ($member->student_id !== Auth::user()->student->student_id) abort(403);

            $newStatus = $request->response === 'accept' ? 'active' : 'rejected';
            
            if ($newStatus === 'rejected') $member->delete();
            else $member->update(['member_status' => $newStatus]);

            return redirect()->back()->with('success', "Invitation processed.");
        }
        return redirect()->back()->with('error', 'Invalid ID');
    }

    private function mapStatus($status)
    {
        $s = strtolower($status ?? '');
        if (in_array($s, ['active', 'approved', 'accepted'])) return 'approved';
        if (in_array($s, ['rejected', 'declined', 'cancelled'])) return 'rejected';
        return 'pending';
    }
}