<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserManagementController extends Controller
{
    public function index(Request $request)
    {
        return inertia('UserManagementPage', [
            'user' => $request->user(),
        ]);
    }
}
