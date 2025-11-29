<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Supervision;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class LecturerProfileController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $lecturer = $user->lecturer()
            ->with([
                'supervisions' => function ($q) {
                    $q->where('supervision_status', 'approved')
                        ->with(['student.user']);
                }
            ])
            ->first();

        $lecturerData = $lecturer ? [
            'name'                  => $lecturer->name,
            'nip'                   => $lecturer->nip,
            'email'                 => $lecturer->email,
            'focus'                 => $lecturer->focus,
            'current_supervision'   => $lecturer->supervisions
                ->where('supervision_status', 'approved')
                ->count(),
            'supervision_quota'     => $lecturer->supervision_quota,
        ] : null;

        return Inertia::render('LecturerProfilePage', [
            'lecturer' => $lecturerData,
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        $lecturer = $user->lecturer;
        $master  = $lecturer->masterlecturer;

        $rules = [
            // 'name'  => 'required|string|max:255',
            'focus' => 'nullable|string|in:BIG DATA,MTI,JARINGAN',
        ];

        $old_email = $master->email;
        $new_email = $request->input('email');

        if ($old_email != $new_email) {
            $rules['email'] = 'required|string|max:255|unique:master_lecturers,email';
        } else {
            $rules['email'] = 'required|string|max:255';
        }

        $validated = $request->validate($rules);

        $lecturer->focus = $validated['focus'] ?? $lecturer->focus;

        // $master->full_name = $validated['name'];
        $master->email     = $validated['email'];

        if ($lecturer->isDirty()) {
            $lecturer->save();
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
            'password' => ['nullable', 'string', 'min:8', 'max:15', 'confirmed'],
        ];

        $old_username = $user->username;
        $new_username = $request->input('username');

        if ($old_username != $new_username) {
            $rules['username'] = ['required', 'string', 'max:255', 'unique:users,username'];
        } else {
            $rules['username'] = 'required';
        }

        $validated = $request->validate($rules, [
            'password.max' => 'Password must not exceed 15 characters.',
            'password.min' => 'Password must be at least 8 characters.',
        ]);

        if ($old_username !== $new_username) {
            $user->username = $validated['username'];
        }

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        if ($user->isDirty()) {
            $user->save();
            return redirect()->back()->with('success', 'Account updated successfully.');
        }

        return redirect()->back();
    }
}
