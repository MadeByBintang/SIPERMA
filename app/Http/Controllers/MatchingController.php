<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MatchingController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Map role_id ke role_name sesuai DB
        $roleName = match ($user->role_id) {
            1 => 'admin',
            2 => 'dosen',
            3 => 'mahasiswa',
            default => 'mahasiswa',
        };

        return inertia('MatchingPage', [
            'currentUserName' => $user->username,
            'userRole' => $roleName, // <- penting
        ]);
    }
}
