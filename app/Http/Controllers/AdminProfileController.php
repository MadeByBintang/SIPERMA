<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminProfileController extends Controller
{
    public function index(Request $request)
    {
        return inertia('AdminProfilePage', [
            'user' => $request->user(),
        ]);
    }
}
