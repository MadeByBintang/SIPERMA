<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Skill;
use App\Models\Supervision;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class LecturerProfileController extends Controller
{
    public function index(){
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $lecturer = $user -> lecturer() -> with(['skills', 'supervisions.student.user']) -> first();
        $all_skills = Skill::select('skill_id as id', 'name')->get();

        $lecturerData = $lecturer ? [
            'name'              => $lecturer -> name,
            'nip'               => $lecturer -> nip,
            'email'             => $lecturer -> email,
            'supervision_quota' => $lecturer -> supervision_quota,

            'skills' => $lecturer->skills->map(fn($s) => [
                'id' => $s->skill_id,
                'name' => $s->name,
                'level' => $s->pivot->level
            ])->toArray(),
        ] : null;

        $supervisedStudents = [];

        if ($lecturer) {
            // Asumsi: supervision menghubungkan student_id dan lecturer_id
            // Kita ambil data relasi student->user untuk dapat nama & NIM
            $supervisedStudents = Supervision::with(['student', 'activity'])
                ->where('lecturer_id', $user->id) // Sesuaikan logika relasi ID Anda (apakah pakai user_id atau lecturer_id tabel terpisah)
                ->where('supervision_status', 'active')
                ->get()
                ->map(function ($s) {
                    return [
                        'id' => $s->supervision_id,
                        'name' => $s->student->name ?? 'Mahasiswa',
                        'nim' => $s->student->username ?? '-', // Asumsi NIM ada di username
                        'interest' => $s->activity->title ?? '-', // Judul project sebagai interest
                        'activityType' => ucfirst($s->activity->activity_type ?? 'Thesis'),
                        'startDate' => $s->assigned_date ? date('M Y', strtotime($s->assigned_date)) : '-',
                        'status' => ucfirst($s->supervision_status),
                    ];
                });
        }

        return Inertia::render('LecturerProfilePage', [
            'lecturer' => $lecturerData,
            'supervisedStudents' => $supervisedStudents,
            'allSkills' => $all_skills
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $lecturer = $user -> lecturer;

        $skills = collect($request->skills)->mapWithKeys(function ($skill) {
            return [$skill['id'] => ['level' => $skill['level'] ?? 1]];
        })->toArray();
        $lecturer->skills()->sync($skills);

        return redirect()->route('profile.lecturer') -> with('success', 'Profile updated successfully');
    }

    public function updateAccount(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $rules = [
            'current_password' => ['required', 'current_password'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ];

        $old_username = $user -> username;
        $new_username = $request -> input('username');

        if ($old_username != $new_username){
            $rules['username'] = ['required', 'string', 'max:255', 'unique:users,username'];
        }
        else {
            $rules['username'] = 'required';
        }

        $validated = $request->validate($rules);


        if ($old_username !== $new_username) {
            $user -> username = $validated['username'];
        }

        if (!empty($validated['password'])) {
            $user -> password = Hash::make($validated['password']);
        }

        if ($user->isDirty()) {
            $user->save();
            return redirect()->back()->with('success', 'Account updated successfully.');
        }

        return redirect()->back();
    }
}
