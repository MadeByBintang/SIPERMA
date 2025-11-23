<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Skill;

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
                'name' => $s->name
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

        $skillIds = $request->input('skills', []);

        $syncData = [];
        foreach ($skillIds as $id) {
            $syncData[$id] = ['level' => 3];
        }

        $student->skills()->sync($syncData);

        return redirect()->route('profile.student') -> with('success', 'Profile updated successfully');
    }
}
