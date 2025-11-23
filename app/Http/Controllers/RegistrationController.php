<?php

namespace App\Http\Controllers;

use App\Models\Lecturer;
use App\Models\Student;
use App\Models\Supervision;
use App\Models\Team;
use App\Models\TeamMember;
use App\Models\Activity;
use App\Models\Institution; // Pastikan Model ini diimport
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RegistrationController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $currentStudent = $user->student;

        if (!$currentStudent) {
            return redirect()->route('dashboard')->with('error', 'Halaman khusus mahasiswa.');
        }

        // [BARU] Ambil Data Institusi untuk Dropdown Frontend
        $institutions = Institution::select('id', 'name')->orderBy('name')->get();

        // Ambil data Dosen
        $lecturers = Lecturer::with(['user', 'skills', 'masterLecturer'])
            ->get()
            ->map(function ($lecturer) {
                return [
                    'id' => $lecturer->lecturer_id,
                    'name' => $lecturer->user->name ?? $lecturer->masterLecturer->full_name ?? 'Unknown',
                    'expertise' => $lecturer->skills->pluck('name')->toArray(), 
                    'currentStudents' => $lecturer->supervisions()->where('supervision_status', 'active')->count(),
                    'maxStudents' => $lecturer->quota ?? 8, 
                    'availability' => ($lecturer->supervisions()->count() < ($lecturer->quota ?? 8)) ? 'Available' : 'Full',
                    'matchScore' => rand(70, 99), 
                ];
            });

        // Data Mahasiswa (Calon Teman Tim)
        $students = Student::with(['user', 'skills'])
            ->where('student_id', '!=', $currentStudent->student_id)
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->student_id, 
                    'name' => $student->name ?? $student->user->name,
                    'nim' => $student->nim,
                    'interests' => $student->skills->pluck('name')->toArray(),
                    'matchScore' => rand(70, 99),
                ];
            });

        return Inertia::render('RegistrationPage', [
            'studentInfo' => [
                'name' => $currentStudent->name ?? $user->name,
                'nim' => $currentStudent->nim,
                'interests' => $currentStudent->skills->pluck('name')->toArray(),
            ],
            'recommendedTeamMembers' => $students,
            'recommendedSupervisors' => $lecturers,
            'institutions' => $institutions, // Kirim ke Frontend
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $student = $user->student;
        
        if (!$student) return redirect()->back()->with('error', 'Data mahasiswa tidak ditemukan.');

        $request->validate(['activityType' => 'required|in:pkl,skripsi,competition']);

        DB::beginTransaction();
        try {
            if ($request->activityType === 'skripsi') {
                $this->storeThesis($request, $student);
            } else {
                $this->storeTeamActivity($request, $student);
            }

            DB::commit();
            return redirect()->route('application.status')->with('success', 'Registration submitted successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to submit registration: ' . $e->getMessage());
        }
    }

    
    private function storeThesis($request, $student)
    {
        $request->validate([
            'title' => 'required|string',
            'abstract' => 'required|string',
            'mainSupervisor' => 'required|exists:lecturers,lecturer_id', 
        ]);

        // 1. Create Activity dulu
        $activity = Activity::create([
            'activity_type_id' => 1, // Asumsi ID 1 = Skripsi
            'title' => $request->title,
            'description' => $request->abstract,
            'start_date' => now(),
        ]);

        // 2. Create Supervision
        Supervision::create([
            'student_id' => $student->student_id,
            'lecturer_id' => $request->mainSupervisor,
            'activity_id' => $activity->activity_id,
            'supervision_status' => 'pending',
            'assigned_date' => now(),
            'notes' => "Title: {$request->title}\nAbstract: {$request->abstract}",
        ]);
    }

    
    private function storeTeamActivity($request, $student)
    {
        $typeString = $request->activityType === 'pkl' ? 'PKL' : 'Competition';
        $typeId = $request->activityType === 'pkl' ? 2 : 3; // Asumsi ID 2=PKL, 3=Competition

        // --- LOGIKA BARU UNTUK MENANGANI INSTANSI ---
        $institutionId = null;

        if ($request->activityType === 'pkl') {
            // Cek apakah user memilih 'New Institution' (checkbox di frontend)
            if ($request->boolean('isNewInstitution')) {
                // Validasi Data Instansi Baru
                $request->validate([
                    'newInstitutionName' => 'required|string|max:255',
                    'newInstitutionSector' => 'required|string|max:50',
                    'newOwnerName' => 'required|string|max:100',
                    // Email & Phone owner boleh null sesuai database
                    'newOwnerEmail' => 'nullable|email|max:100',
                    'newOwnerPhone' => 'nullable|string|max:20',
                ]);

                // Create Institution Baru
                $newInst = Institution::firstOrCreate(
                    ['name' => $request->newInstitutionName],
                    [
                    'sector' => $request->newInstitutionSector,
                    'address' => $request->newInstitutionAddress,
                    'owner_name' => $request->newOwnerName,
                    'owner_email' => $request->newOwnerEmail,
                    'owner_phone' => $request->newOwnerPhone,
                ]);
                
                $institutionId = $newInst->id;

            } else {
                // Jika memilih instansi lama, validasi ID-nya
                $request->validate([
                    'institution_id' => 'required|exists:institutions,id',
                ]);
                $institutionId = $request->institution_id;
            }
        }

        $request->validate([
            'supervisor' => 'required|exists:lecturers,lecturer_id',
        ]);

        // 1. Create Activity dulu
        $activity = Activity::create([
            'activity_type_id' => $typeId,
            'title' => $request->activityType === 'pkl' ? 'PKL Team - ' . $student->name : $request->competitionName,
            'description' => $request->description ?? $request->competitionField,
            'start_date' => now(),
            'institution_id' => $institutionId, // Masukkan ID (Baru atau Lama)
        ]);
        
        // 2. Create Team
        $team = Team::create([
            'name' => $activity->title,
            'type' => $typeString,
            'leader_id' => $student->user_id, 
            'supervisor_id' => $request->supervisor,
            'activity_id' => $activity->activity_id, 
            'description' => $activity->description,
            'status' => 'pending',
        ]);

        // 3. Create Member (Leader)
        TeamMember::create([
            'team_id' => $team->team_id,
            'student_id' => $student->student_id,
            'role_in_team' => 'Leader',
            'member_status' => 'active',
        ]);

        // 4. Create Members (Invited)
        if ($request->has('teamMembers') && is_array($request->teamMembers)) {
            foreach ($request->teamMembers as $memberId) {
                TeamMember::create([
                    'team_id' => $team->team_id,
                    'student_id' => $memberId,
                    'role_in_team' => 'Member',
                    'member_status' => 'pending', 
                ]);
            }
        }
    }
}