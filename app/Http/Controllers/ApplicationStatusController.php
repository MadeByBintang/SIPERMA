<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ApplicationStatusController extends Controller
{
    public function index(Request $request)
    {

        return inertia('ApplicationStatusPage', [
            'user' => $request->user(),
        ]);

        // $user = $request->user();

        // // Ambil data aplikasi dari database sesuai user
        // // Misal tabel 'applications' punya kolom: id, student_id, activity_type, status, created_at
        // $applications = \DB::table('applications')
        //     ->where('student_id', $user->id)
        //     ->orderBy('created_at', 'desc')
        //     ->get();

        // // Return ke Inertia + Vue/React page
        // return Inertia::render('ApplicationStatusPage', [
        //     'applications' => $applications,
        // ]);
    }
}
