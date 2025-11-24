<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use App\Models\User;

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
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Validasi input sesuai field di JSX
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'username' => 'nullable|string|max:255|unique:users,username,' . $user->id,
        ]);

        // Update data user
        // forceFill memungkinkan pengisian data tanpa harus mendefinisikan $fillable satu per satu
        $user->forceFill([
            'name' => $validated['name'],
            'email' => $validated['email'],
            // Pastikan kolom-kolom ini sudah ada di database Anda (via migration)
            // Jika belum ada, beri komentar (//) pada baris yang belum ada kolomnya
            // 'username' => $validated['username'],
            // 'phone' => $validated['phone'],
            // 'position' => $validated['position'],
            // 'department' => $validated['department'],
            // 'address' => $validated['address'],
        ])->save();

        // Redirect kembali agar data ter-refresh
        return redirect()->route('profile.admin');
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
