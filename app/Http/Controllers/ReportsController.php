<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ReportsController extends Controller
{
    public function index()
    {
        return inertia('ReportPage'); // Nama komponen React/Blade
    }
}
