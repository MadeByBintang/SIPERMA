<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Supervision;
use Illuminate\Support\Carbon;


class AdminRelationsController extends Controller
{
    public function index()
    {
        return Inertia::render('AdminRelationsPage', [
            'studentStudentRelations' => $this -> ss(),
            'studentLecturerRelations' => $this -> slRelations(),
        ]);
    }


    private function ss(){
        $projects = Supervision::with([
            'student.user',
            'lecturer.user',
            'activity.internship',
            'team.members.student.masterStudent',
        ])
            ->has('team')
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
                    'id' => $item->supervision_id . "SS" . ($item->team?->team_id ?? 'NoTeam'),
                    'status' => $item->supervision_status,

                    'startDate' => $item->activity->start_date
                        ? Carbon::parse($item->activity->start_date)->format('Y-m-d')
                        : "",
                    'endDate' => $item->activity->end_date
                        ? Carbon::parse($item->activity->end_date)->format('Y-m-d')
                        : "",

                    /* ===== LECTURER ===== */
                    'lecturerName' => $item->lecturer->name ?? 'Unknown',
                    'lecturerNip' => $item->lecturer->nip ?? '-',

                    /* ===== ACTIVITY ===== */
                    'activityType' => $item->activity->activityType->type_name ?? '-',
                    'activityTitle' => $item->activity->title ?? 'Untitled Project',
                    'description' => $item->activity->description ?? '-',
                    'teamMembers' => $teamMembers,
                ];
            });
        return $projects;
    }

    private function slRelations(){
        $supervisions = Supervision::with([
            'student.user',
            'lecturer.user',
            'activity',
            'team.members.student.masterStudent',
        ])
            ->orderBy('supervision_id', 'desc')
            ->get()
            ->flatMap(function ($item) {

                $involvedStudents = collect();

                if ($item->student) {
                    $involvedStudents->push($item->student);
                }

                if ($item->team && $item->team->members) {
                    foreach ($item->team->members as $member) {
                        if ($member->student) {
                            $involvedStudents->push($member->student);
                        }
                    }
                }

                $uniqueStudents = $involvedStudents->unique('student_id');

                return $uniqueStudents->map(function ($student) use ($item) {
                    return [
                        'id'            => $item->supervision_id . "SL" . $student->student_id,
                        'status'        => $item->supervision_status,
                        'startDate'     => $item->activity->start_date
                                            ? Carbon::parse($item->activity->start_date)->format('Y-m-d')
                                            : "",
                        'endDate'       => $item->activity->end_date
                                            ? Carbon::parse($item->activity->end_date)->format('Y-m-d')
                                            : Carbon::now()->format('Y-m-d'),

                        'activityType'  => $item->activity->activityType->type_name ?? '-',
                        'activityTitle' => $item->activity->title ?? 'Untitled Project',
                        'researchArea'  => $item->lecturer->focus ?? '-',

                        'lecturerId'    => $item->lecturer->lecturer_id,
                        'lecturerName'  => $item->lecturer->name ?? 'Unknown',
                        'lecturerNip'   => $item->lecturer->nip ?? '-',

                        'studentId'     => $student->student_id,
                        'studentName'   => $student->name,
                        'studentNim'    => $student->nim,
                        'isTeamMember'  => ($item->student->student_id !== $student->student_id), // (Opsional) Penanda dia ketua atau anggota
                    ];
                });
            });

        return $supervisions;
    }
}
