<?php

namespace App\Http\Controllers;


use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Supervision;
use Illuminate\Support\Facades\Auth;

class ApplicationStatusController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $student = $user->student;

        $applications = collect();

        $supervisions = Supervision::with([
            'student.user',
            'lecturer.user',
            'activity.internship',
            'activity.activityType',
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
            ->orderBy('supervision_id', 'desc')
            ->get();

        $applications = $supervisions->map(
            function ($sv) use ($student) {

                $companyName = null;
                if ($sv->activity->activityType->type_name === 'Internship') {
                    $companyName = $sv->activity->internship->name
                        ?? 'Unknown Company';
                }

                // Tentukan apakah mahasiswa ini bagian dari tim
                $isTeamMember = $sv->team && $sv->team->members->contains(fn($m) => $m->student_id == $student->student_id);

                // Ambil nama tim & anggota tim jika ada
                $teamName = $sv->team->team_name ?? null;
                $teamMembers = [];
                if ($sv->team) {
                    $teamMembers = $sv->team->members->map(fn($m) => [
                        'member_name' => $m->student->name ?? $m->full_name ?? 'Unknown',
                    ]);
                }


                return [
                    'id' => $sv->supervision_id,
                    'activityType' => $sv->activity->activityType->type_name ?? '-',
                    'activityName' => $sv->activity->title ?? 'Untitled Project',
                    'description' => $sv->activity->description ?? '-',
                    'supervisorName' => $sv->lecturer->name ?? 'Unknown',
                    'supervisorEmail' => $sv->lecturer->email ?? 'Unknown',
                    'submittedDate' => $sv->assigned_date,
                    'status' => $sv->supervision_status,

                    'companyName' => $companyName,

                    'teamName' => $teamName,
                    'teamMembers' => $teamMembers,
                    'responseNotes' => $sv->notes,
                ];
            }
        );


        return Inertia::render('ApplicationStatusPage', [
            'applications' => $applications
        ]);
    }
}
