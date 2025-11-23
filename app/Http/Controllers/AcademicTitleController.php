<?php

namespace App\Http\Controllers;

use App\Models\AcademicTitle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademicTitleController extends Controller
{
    public function index()
    {
        $titles = AcademicTitle::latest()->get();

        return Inertia::render('Admin/AcademicTitle/Index', [
            'titles' => $titles
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50|unique:academic_titles,name',
            'type' => 'required|in:front,back',
        ]);

        AcademicTitle::create($request->all());

        return redirect()->back()->with('success', 'Academic title created successfully.');
    }

    public function update(Request $request, $id)
    {
        $title = AcademicTitle::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:50|unique:academic_titles,name,' . $id,
            'type' => 'required|in:front,back',
        ]);

        $title->update($request->all());

        return redirect()->back()->with('success', 'Academic title updated successfully.');
    }

    public function destroy($id)
    {
        $title = AcademicTitle::findOrFail($id);
        $title->delete();

        return redirect()->back()->with('success', 'Academic title deleted successfully.');
    }
}