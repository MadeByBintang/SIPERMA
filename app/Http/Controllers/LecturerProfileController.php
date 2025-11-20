<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LecturerProfileController extends Controller
{
    public function index(Request $request)
    {
        return inertia('LecturerProfilePage', [
            'user' => $request->user(),
        ]);
    }
}
