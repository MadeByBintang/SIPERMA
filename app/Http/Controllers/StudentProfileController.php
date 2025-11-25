<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class StudentProfileController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $student = $user->student()->with(['supervisions.lecturer.user'])->first();

        $studentData = $student ? [
            'id' => $student->student_id,
            'name' => $student->name,
            'nim' => $student->nim,
            'studyProgram' => 'Teknologi Informasi',
            'email' => $student->email,
            'focus' => $student -> focus
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
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        $student = $user->student;
        $master  = $student->masterStudent;

        $rules = [
            'name'  => 'required|string|max:255',
            'focus' => 'nullable|string|in:BIG DATA,MTI,JARINGAN',
        ];

        $old_email = $master->email;
        $new_email = $request->input('email');

        if ($old_email != $new_email) {
            $rules['email'] = 'required|string|max:255|unique:master_students,email';
        } else {
            $rules['email'] = 'required|string|max:255';
        }

        $validated = $request->validate($rules);

        // Update Student
        $student->focus = $validated['focus'] ?? $student->focus;

        $master->full_name = $validated['name'];
        $master->email     = $validated['email'];

        if ($student->isDirty()) {
            $student->save();
        }

        if ($master->isDirty()) {
            $master->save();
        }

        return redirect()->back()->with('success', 'Profile updated successfully.');
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
