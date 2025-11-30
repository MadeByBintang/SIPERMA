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
            'studentStudentRelations' => $this -> ssRelations(),
            'studentLecturerRelations' => $this -> slRelations(),
        ]);
    }

    private function ssRelations(){
        $supervisions = Supervision::with([
            'student.user',
            'lecturer.user',
            'activity',
            'team.members.student.masterStudent',
        ])
            ->orderBy('supervision_id', 'desc')
            ->get()
            ->map(function ($item) {

                $students = collect();

                // 1) Tambahkan owner supervision sebagai student pertama
                $students->push([
                    'id'    => $item->student->student_id,
                    'name'  => $item->student->name,
                    'nim'   => $item->student->nim,
                ]);

                // 2) Tambahkan anggota tim (kalau ada)
                if ($item->team) {
                    $sortedMembers = $item->team->members
                        ->sortBy('pivot.id')
                        ->values();

                    foreach ($sortedMembers as $m) {
                        // lewati pemilik supaya tidak duplikat
                        if ($m->student->student_id == $item->student->student_id) {
                            continue;
                        }

                        $students->push([
                            'id'    => $m->student->student_id,
                            'name'  => $m->student->name ?? $m->full_name ?? 'Unknown',
                            'nim'   => $m->student->nim,
                        ]);
                    }
                }

                // 3) Ubah menjadi struktur flat: student1Id, student2Name, dst.
                $studentPayload = [];
                for ($i = 0; $i < 4; $i++) {
                    $num = $i + 1;
                    $studentPayload["student{$num}Id"]   = $students[$i]['id']  ?? ' ';
                    $studentPayload["student{$num}Name"] = $students[$i]['name'] ?? ' ';
                    $studentPayload["student{$num}Nim"]  = $students[$i]['nim']  ?? ' ';
                }


                return array_merge($studentPayload, [
                    /* ===== SUPERVISION ===== */
                    'id' => $item->supervision_id,
                    'status' => $item->supervision_status,

                    'startDate' => $item->activity->start_date
                        ? Carbon::parse($item->activity->start_date)->format('Y-m-d')
                        : "",
                    'endDate' => $item->activity->end_date
                        ? Carbon::parse($item->activity->end_date)->format('Y-m-d')
                        : Carbon::now()->format('Y-m-d'),

                    'activityType' => $item->activity->activityType->type_name ?? '-',
                    'activityTitle' => $item->activity->title ?? 'Untitled Project',
                    'description' => $item->activity->description ?? '-',
                ]);
            });

        return $supervisions;
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
            ->map(function ($item) {

                return [
                    'id' => $item->supervision_id,
                    'status' => $item->supervision_status,

                    'startDate' => $item->activity->start_date
                        ? Carbon::parse($item->activity->start_date)->format('Y-m-d')
                        : "",
                    'endDate' => $item->activity->end_date
                        ? Carbon::parse($item->activity->end_date)->format('Y-m-d')
                        : Carbon::now()->format('Y-m-d'),


                    'lecturerId'    => $item -> lecturer -> lecturer_id,
                    'lecturerName' => $item->lecturer->name ?? 'Unknown',
                    'lecturerNip' => $item->lecturer->nip ?? '-',

                    'studentId'     => $item -> student -> student_id,
                    'studentName' => $item -> student -> name,
                    'studentNim' => $item -> student -> nim,

                    'researchArea' => $item -> lecturer -> focus,

                    'activityType' => $item -> activity -> activityType ->type_name,
                    'activityTitle' => $item->activity->title ?? 'Untitled Project',
                ];
            });

        return $supervisions;
    }
}
