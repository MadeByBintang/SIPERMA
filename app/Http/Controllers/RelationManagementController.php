<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Supervision;
use Illuminate\Support\Facades\Auth;

class RelationManagementController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        return Inertia::render('RelationManagementPage', [
            'studentStudentRelations' => $this -> ssRelations(),
            'studentLecturerRelations' => $this -> slRelations(),
        ]);
    }

    private function ssRelations(){
        $supervisions = Supervision::with([
            'student.user',
            'lecturer.user',
            'activity.internship',
            'team.members.student.masterStudent',
        ])
            ->whereHas('activity', function ($q) {
                $q->whereIn('activity_type_id', [2, 3]);
            })
            ->whereIn('supervision_status', ['approved', 'completed'])
            ->orderBy('supervision_id', 'desc')
            ->get()
            ->map(function ($item) {

                /* ===== TEAM HANDLING ===== */
                $teamMembers = [];

                if ($item->team) {
                    $sortedMembers = $item->team->members
                        ->sortBy('pivot.id')
                        ->values();

                    $teamMembers = $sortedMembers->map(function ($m) {
                        return [
                            'name'  => $m->student->name ?? $m->full_name ?? 'Unknown',
                            'nim'   => $m->student->nim,
                        ];
                    });
                }

                $companyLocation = null;
                if ($item->activity->activity_type_id === 2) {
                    $companyLocation = $item -> activity -> internship -> address
                        ?? 'Unknown Adress';
                }

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
                        : Carbon::now()->format('Y-m-d'),

                    'supervisorName' => $item->lecturer->name ?? 'Unknown',
                    'supervisorNIP' => $item->lecturer->nip ?? '-',

                    'activityType' => $item->activity->activityType->type_name ?? '-',
                    'activityName' => $item->activity->title ?? 'Untitled Project',
                    'description' => $item->activity->description ?? '-',

                    'location' => $companyLocation,

                    'teamMembers' => $teamMembers,
                ];
            });

        return $supervisions;
    }

    private function slRelations(){
        $supervisions = Supervision::with([
            'student.user',
            'lecturer.user',
            'activity.internship.name',
            'team.members.student.masterStudent',
        ])
            ->whereHas('activity', function ($q) {
                $q->whereIn('activity_type_id', [1]);
            })
            ->whereIn('supervision_status', ['approved', 'completed'])
            ->orderBy('supervision_id', 'desc')
            ->get()
            ->map(function ($item) {


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
                        : Carbon::now()->format('Y-m-d'),


                    'supervisorName' => $item->lecturer->name ?? 'Unknown',
                    'supervisorNIP' => $item->lecturer->nip ?? '-',

                    'studentName' => $item -> student -> name,
                    'studentNIM' => $item -> student -> nim,

                    'researchArea' => $item -> lecturer -> focus,

                    'activityType' => 'Thesis',
                    'thesisTitle' => $item->activity->title ?? 'Untitled Project',
                    'activityDescription' => $item->activity->description ?? '-',
                ];
            });

        return $supervisions;
    }

}
