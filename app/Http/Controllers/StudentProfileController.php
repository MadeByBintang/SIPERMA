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

        $studentData = $student ? [
            'id' => $student->student_id,
            'name' => $user->name,
            'nim' => $student->nim,
            'studyProgram' => $student->major ?? 'Information Technology',
            'email' => $user->email,
            //'phone' => $user->phone ?? '-',
            //'gpa' => (string) ($student->gpa ?? 0.0),
            'semester' => $student->year ? (date('Y') - $student->year) * 2 + (date('n') > 6 ? 1 : 0) : '1',
            'description' => "Student at University", 
            'interests' => $student->skills->pluck('name')->toArray(),
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
            'allSkills' => Skill::pluck('name')->toArray(), 
        ]);
    }

    public function update(Request $request)
    {
        // --- PERBAIKAN DI SINI ---
        // Baris ini memberitahu editor bahwa $user adalah Model User, bukan sekadar interface Auth
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        $student = $user->student;

        $validated = $request->validate([
            //'phone' => 'nullable|string|max:20',
            'description' => 'nullable|string|max:500',
            'interests' => 'array',
        ]);

        // 1. Update User (Phone)
        // Pastikan 'phone' sudah ditambahkan ke $fillable di App\Models\User.php
        $user->update(['phone' => $validated['phone']]);

        // 2. Update Student (Jika ada field description di tabel students)
        // if ($student) {
        //    $student->update(['description' => $validated['description']]); 
        // }

        // 3. Sync Skills (Interests)
        if ($student && isset($validated['interests'])) {
            $skillIds = [];
            foreach ($validated['interests'] as $skillName) {
                $skill = Skill::firstOrCreate(['name' => $skillName]);
                $skillIds[] = $skill->skill_id; // Menggunakan 'skill_id' sesuai model Skill Anda
            }
            $student->skills()->sync($skillIds);
        }

        return redirect()->back()->with('success', 'Profile updated successfully');
    }
}