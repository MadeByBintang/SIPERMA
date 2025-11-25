<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class StudentProfileController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Eager load data student dan skills
        $student = $user->student()->with(['skills', 'supervisions.lecturer.user'])->first();

        $all_skills = Skill::select('skill_id as id', 'name')->get();

        $studentData = $student ? [
            'id' => $student->student_id,
            'name' => $student->name,
            'nim' => $student->nim,
            'studyProgram' => 'Teknologi Informasi',
            'email' => $student->email,
            'skills' => $student->skills->map(fn($s) => [
                'id' => $s->skill_id,
                'name' => $s->name,
                'level' => $s->pivot->level
            ])->toArray(),
        ] : null;

        $supervisors = $student ? $student->supervisions->map(function($sup) {
            return [
                'id' => $sup->supervision_id,
                'name' => $sup->lecturer->user->name ?? $sup->lecturer->name ?? 'Unknown',
                'expertise' => 'Lecturer',
                'period' => $sup->assigned_date ? date('M Y', strtotime($sup->assigned_date)) . ' - Present' : '-',
                'status' => ucfirst($sup->supervision_status),
            ];
        }) : [];

        return Inertia::render('StudentProfilePage', [
            'student' => $studentData,
            'supervisors' => $supervisors,
            'allSkills' => $all_skills
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $student = $user -> student;

        $skills = collect($request->skills)->mapWithKeys(function ($skill) {
            return [$skill['id'] => ['level' => $skill['level'] ?? 1]];
        })->toArray();
        $student->skills()->sync($skills);

        return redirect()->route('profile.student') -> with('success', 'Profile updated successfully');
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
