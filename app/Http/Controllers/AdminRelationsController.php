<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminRelationsController extends Controller
{
    public function index(Request $request)
    {
        return inertia('AdminRelationsPage', [
            'user' => $request->user(),
        ]);
    }
}
