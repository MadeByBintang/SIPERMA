<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Setting; // Jangan lupa import

class SystemSettingsController extends Controller
{
    public function index(Request $request)
    {
        // Ambil semua setting dari DB dan ubah jadi format key => value
        // Contoh hasil: ['max_students_per_lecturer' => '5', 'registration_enabled' => '1']
        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('SystemSettingsPage', [
            'initialSettings' => $settings, // Kirim ke Frontend
        ]);
    }

    public function update(Request $request)
    {
        // Validasi input (sesuaikan dengan kebutuhan)
        $data = $request->validate([
            'max_students_per_lecturer' => 'required|integer|min:1',
            'max_pkl_per_lecturer' => 'required|integer|min:1',
            'max_thesis_per_lecturer' => 'required|integer|min:1',
            'max_competition_per_lecturer' => 'required|integer|min:1',
            
            'registration_enabled' => 'boolean',
            'auto_approval' => 'boolean',
            'require_approval' => 'boolean',
            
            'email_notifications' => 'boolean',
            'system_notifications' => 'boolean',
            'deadline_reminders' => 'boolean',
            'reminder_days_before' => 'required|integer',
            
            'maintenance_mode' => 'boolean',
            'data_retention_period' => 'required|string',
        ]);

        // Simpan loop ke database (Update or Create)
        foreach ($data as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return redirect()->back()->with('success', 'Settings updated successfully');
    }
}