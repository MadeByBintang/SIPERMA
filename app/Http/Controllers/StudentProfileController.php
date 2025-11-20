<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentProfileController extends Controller
{
    public function index(Request $request)
    {
        return inertia('StudentProfilePage', [
            'user' => $request->user(),
        ]);
    }
}
