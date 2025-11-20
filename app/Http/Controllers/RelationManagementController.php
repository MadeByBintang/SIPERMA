<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RelationManagementController extends Controller
{
    public function index()
    {
        return inertia('RelationManagementPage'); // Nama komponen React/Blade
    }
}
