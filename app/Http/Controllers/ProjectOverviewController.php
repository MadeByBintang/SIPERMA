<?php

namespace App\Http\Controllers;

use App\Models\Supervision;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ProjectOverviewController extends Controller
{
    public function index()
    {
        $projects = Supervision::with([
            'student.user',
            'lecturer.user',
            'activity.internship',
            'activity.logs',
            'team.members.student.masterStudent',
        ])
            ->orderBy('supervision_id', 'desc')
            ->get()
            ->map(function ($item) {
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
                        return $m->student->name
                            ?? $m->full_name
                            ?? 'Unknown';
                    });

                }

                return [
                    /* ===== SUPERVISION ===== */
                    'id' => $item->supervision_id,
                    'status' => $item->supervision_status,

                    'startDate' => $item->activity->start_date
                        ? Carbon::parse($item->activity->start_date)->format('Y-m-d')
                        : "",
                    'endDate' => $item->activity->end_date
                        ? Carbon::parse($item->activity->end_date)->format('Y-m-d')
                        : "",

                    /* ===== LECTURER ===== */
                    'supervisor' => $item->lecturer->name ?? 'Unknown',

                    /* ===== ACTIVITY ===== */
                    'type' => $item->activity->activityType->type_name ?? '-',
                    'title' => $item->activity->title ?? 'Untitled Project',
                    'description' => $item->activity->description ?? '-',
                    'teamMembers' => !empty($teamMembers)
                        ? $teamMembers->values()->all()
                        : [$item->student->name],
                            ];
                    });


        return Inertia::render('ProjectOverviewPage', [
            'all_projects' => $projects
        ]);
    }
}
