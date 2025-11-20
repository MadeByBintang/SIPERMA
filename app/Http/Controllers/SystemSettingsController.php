<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SystemSettingsController extends Controller
{
    public function index(Request $request)
    {
        return inertia('SystemSettingsPage', [
            'user' => $request->user(),
        ]);
    }
}
