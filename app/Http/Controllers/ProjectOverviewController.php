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
            'team.members.student.masterStudent',
        ])
            ->orderBy('supervision_id', 'desc')
            ->get()
            ->map(function ($item) {
                $teamMembers = [];

                if ($item->team) {
                    // Urutkan leader berdasarkan pivot id
                    $sortedMembers = $item->team->members
                        ->sortBy('pivot.id')
                        ->values();

                    // Konversi ke array dengan name dan nim
                    $teamMembers = $sortedMembers->map(function ($m) {
                        return [
                            'name' => $m->student->name ?? $m->full_name ?? 'Unknown',
                            'nim' => $m->student->nim ?? '-',
                        ];
                    })->toArray();
                }

                // Jika tidak ada team members, gunakan student owner
                if (empty($teamMembers)) {
                    $teamMembers = [[
                        'name' => $item->student->name,
                        'nim' => $item->student->nim ?? '-',
                    ]];
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
                    'supervisorNip' => $item->lecturer->nip ?? '-',

                    /* ===== ACTIVITY ===== */
                    'type' => $item->activity->activityType->type_name ?? '-',
                    'title' => $item->activity->title ?? 'Untitled Project',
                    'description' => $item->activity->description ?? '-',
                    'teamMembers' => $teamMembers,
                ];
            });

        return Inertia::render('ProjectOverviewPage', [
            'all_projects' => $projects
        ]);
    }
}
