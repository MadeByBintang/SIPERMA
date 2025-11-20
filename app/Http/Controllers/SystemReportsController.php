<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SystemReportsController extends Controller
{
    public function index(Request $request)
    {
        return inertia('SystemReportsPage', [
            'user' => $request->user(),
        ]);
    }
}
