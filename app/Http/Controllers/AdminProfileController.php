<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AdminProfileController extends Controller
{

    public function index()
    {
        /** @var \App\Models\User $user */
        $admin = Auth::user() -> admin;

        return Inertia::render('AdminProfilePage', [
            'admin' => [
                'full_name' => $admin -> full_name,
                'email'     => $admin -> email
            ]
        ]);
    }



    public function update(Request $request)
    {
        // Ambil user login dan relasi admin
        $user = Auth::user();
        $admin = $user->admin;

        // Atur rules validasi
        $rules = [
            'full_name' => ['required', 'string', 'max:255'],
        ];

        // Validasi email hanya jika berubah
        if ($request->input('email') !== ($admin?->email ?? '')) {
            $rules['email'] = [
                'required',
                'email',
                Rule::unique('admins')->ignore($admin->id ?? null),
            ];
        } else {
            $rules['email'] = ['required', 'email'];
        }

        // Validasi request
        $validated = $request->validate($rules);

        // Trim input agar bersih
        $full_name = trim($validated['full_name']);
        $email     = trim($validated['email']);

        // Update jika admin sudah ada, atau create jika belum
        if ($admin) {
            $admin->update([
                'full_name' => $full_name,
                'email'     => $email,
            ]);
        } else {
            $admin = Admin::create([
                'user_id'   => $user->id,
                'full_name' => $full_name,
                'email'     => $email,
            ]);
        }

        // Redirect kembali dengan flash message sukses
        return redirect()->back()->with('success', 'Profile updated successfully.');
    }


    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        /** @var \App\Models\User $user */
        $user = $request->user();

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back();
    }
}
