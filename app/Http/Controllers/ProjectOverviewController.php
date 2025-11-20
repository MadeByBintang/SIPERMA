<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProjectOverviewController extends Controller
{
    public function index()
    {
        return inertia('ProjectOverviewPage'); // Nama komponen React/Blade
    }
}
