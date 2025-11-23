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
        $user = Auth::user();

        return Inertia::render('AdminProfilePage', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    
                    'role_name' => $user->role->role_name ?? 'admin',
                    
                    
                    'username' => $user->username ?? 'admin',
                    //'phone' => $user->phone ?? null,
                    'position' => $user->position ?? null,
                    'department' => $user->department ?? null,
                    'address' => $user->address ?? null,
                ],
            ],
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
            //'phone' => 'nullable|string|max:20',
            'position' => 'nullable|string|max:100',
            'department' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:500',
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