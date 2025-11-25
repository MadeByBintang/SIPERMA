<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Student;
use App\Models\Lecturer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class MatchingController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Pastikan role terload
        // $user->load('role'); // Jika pakai relasi role
        $roleName = $user->role_name; // Atau pakai kolom role_name di users

        $matches = [];

        if ($roleName === 'mahasiswa' && $user->student) {
            $matches = $this->generateMatchesForStudent($user->student);
        } elseif ($roleName === 'dosen' && $user->lecturer) {
            $matches = $this->generateMatchesForLecturer($user->lecturer);
        } else {
            // Jika masuk sini, berarti Role tidak cocok atau data Student/Lecturer null
            dd("Role Name: " . $roleName, "User ID: " . $user->id, "Student Data:", $user->student, "Lecturer Data:", $user->lecturer);
        }

        return Inertia::render('MatchingPage', [
            'user' => [
                'full_name' => $user -> student-> name ?? $user -> lecturer -> name,
                'role_name' => $user -> role_name
            ],
            'matches' => $matches
        ]);
    }



    private function generateMatchesForStudent($student)
    {
        $my_focus = $student -> focus;

        $students = Student::with('user')
            ->whereHas('masterStudent', function ($query) {
                $query->where('is_active', true);
            })
            ->where('student_id', '!=', $student->student_id)
            ->get();

        $lecturers = Lecturer::with('user')
            ->whereHas('masterLecturer', function ($query) {
                $query->where('is_active', true);
            })
            ->get();

        return [
            'students' => $this -> sortAndMap($students, $my_focus, 'student'),
            'lecturers' => $this -> sortAndMap($lecturers, $my_focus, 'lecturer')
        ];
    }

    private function sortAndMap($collection, $myFocus, $type)
    {
        return $collection->map(function ($item) use ($myFocus, $type) {

            $targetFocus = $item->focus;

            // 0 = Focus Sama Persis (Prioritas Utama)
            // 1 = Focus Beda (Prioritas Kedua)
            // 2 = Focus Null/Kosong (Prioritas Terakhir)
            $matchStatus = 2;

            if ($targetFocus === null) {
                $matchStatus = 2;
            } elseif ($myFocus !== null && strcasecmp($targetFocus, $myFocus) === 0) {
                $matchStatus = 0;
            } else {
                $matchStatus = 1;
            }

            $uid = ($type === 'lecturer') ? $item->nip : $item->nim;

            return [
                'id' => $item->lecturer_id ?? $item->student_id,
                'name' => $item->name,
                'uid' => $uid,
                'focus' => $targetFocus ?? '',
                'email' => $item->email ?? '-',
                'type' => $type,

                '_matchStatus' => $matchStatus,
            ];
        })
        ->sort(function ($a, $b) {
            if ($a['_matchStatus'] !== $b['_matchStatus']) {
                return $a['_matchStatus'] <=> $b['_matchStatus'];
            }

            $nameComparison = strcasecmp($a['name'], $b['name']);
            if ($nameComparison !== 0) {
                return $nameComparison;
            }

            return $a['uid'] <=> $b['uid'];
        })
        ->values();
    }

    private function generateMatchesForLecturer($lecturer)
    {
        $my_focus = $lecturer -> focus;

        $students = Student::with('user')
            ->whereHas('masterStudent', function ($query) {
                $query->where('is_active', true);
            })
            ->get();

        return [
            'students' => $this -> sortAndMap($students, $my_focus, 'student'),
        ];
    }
}
