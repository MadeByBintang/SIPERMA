<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    // Dashboard umum (mahasiswa / dosen)
    public function index(Request $request)
    {
        if ($request->user()->role_name === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        return inertia('Dashboard');
    }


    // Dashboard khusus admin
    public function adminIndex(Request $request)
    {
        // Cek role manual di controller, bukan middleware
        if ($request->user()->role_name !== 'admin') {
            return redirect()->route('dashboard');
        }

        return inertia('AdminDashboardPage');
    }
}
