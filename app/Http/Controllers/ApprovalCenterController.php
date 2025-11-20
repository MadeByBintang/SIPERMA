<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ApprovalCenterController extends Controller
{
    public function index(Request $request)
    {
        return inertia('ApprovalPage', [
            'user' => $request->user(),
        ]);
    }
}
