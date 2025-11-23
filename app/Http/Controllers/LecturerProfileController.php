<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Supervision;

class LecturerProfileController extends Controller
{
    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        // Mengambil data dosen yang berelasi dengan user saat ini
        // Pastikan di Model User ada: public function lecturer() { return $this->hasOne(Lecturer::class); }
        $lecturer = $user->lecturer; 

        // Ambil daftar mahasiswa yang sedang dibimbing (Active)
        $supervisedStudents = [];
        
        if ($lecturer) {
            // Asumsi: supervision menghubungkan student_id dan lecturer_id
            // Kita ambil data relasi student->user untuk dapat nama & NIM
            $supervisedStudents = Supervision::with(['student', 'activity'])
                ->where('lecturer_id', $user->id) // Sesuaikan logika relasi ID Anda (apakah pakai user_id atau lecturer_id tabel terpisah)
                ->where('supervision_status', 'active') 
                ->get()
                ->map(function ($s) {
                    return [
                        'id' => $s->supervision_id,
                        'name' => $s->student->name ?? 'Mahasiswa',
                        'nim' => $s->student->username ?? '-', // Asumsi NIM ada di username
                        'interest' => $s->activity->title ?? '-', // Judul project sebagai interest
                        'activityType' => ucfirst($s->activity->activity_type ?? 'Thesis'),
                        'startDate' => $s->assigned_date ? date('M Y', strtotime($s->assigned_date)) : '-',
                        'status' => ucfirst($s->supervision_status),
                    ];
                });
        }

        return Inertia::render('LecturerProfilePage', [
            // 'auth' => [
            //     'user' => $user,
            //     'lecturer' => $lecturer, // Data tabel lecturers (NIP, Gelar, dll)
            // ],
            'supervisedStudents' => $supervisedStudents,
            'stats' => [
                'current' => count($supervisedStudents),
                'quota' => $lecturer->quota ?? 10, // Default 10 jika belum diset
            ]
        ]);
    }

    public function update(Request $request)
    {
        // --- PERBAIKAN GARIS MERAH ---
        // Kita beri tahu VS Code bahwa $user adalah Model User, bukan generic object
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        $lecturer = $user->lecturer;

        // Validasi Input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            //'phone' => 'nullable|string|max:20',
            'academic_titles' => 'nullable|array', 
            'expertise' => 'nullable|array',       
            'description' => 'nullable|string',
            'office_location' => 'nullable|string',
            'quota' => 'required|integer|min:0',
            'is_available' => 'boolean',
        ]);

        // 1. Update Data User Utama (Nama & No HP)
        $user->update([
            'name' => $validated['name'],
            //'phone' => $validated['phone'] ?? $user->phone,
        ]);

        // 2. Update Data Tabel Lecturer (Detail Profil)
        if ($lecturer) {
            $lecturer->update([
                // Simpan array sebagai JSON string ke database
                'academic_titles' => json_encode($validated['academic_titles'] ?? []),
                'expertise' => json_encode($validated['expertise'] ?? []),
                'description' => $validated['description'],
                'office_location' => $validated['office_location'],
                'quota' => $validated['quota'],
                'is_available' => $validated['is_available'],
            ]);
        } else {
            
        }

        return redirect()->back()->with('success', 'Profile updated successfully');
    }
}