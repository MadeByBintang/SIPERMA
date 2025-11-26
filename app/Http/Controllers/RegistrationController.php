<?php

namespace App\Http\Controllers;

use App\Models\Lecturer;
use App\Models\Student;
use App\Models\Supervision;
use App\Models\Team;
use App\Models\TeamMember;
use App\Models\Activity;
use App\Models\Internship;
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

        $userFocus = $currentStudent->focus;

        $institutions = Internship::select('internship_id', 'name')
            ->orderBy('name')
            ->get();

        $allLecturers = Lecturer::with(['user', 'masterLecturer'])
            ->get()
            ->map(function ($lecturer) {
                return [
                    'id' => $lecturer->lecturer_id,
                    'name' => $lecturer->user->name ?? $lecturer->masterLecturer->full_name ?? 'Unknown',
                    'expertise' => $lecturer->focus,
                    'currentStudents' => $lecturer->supervisions()->where('supervision_status', 'active')->count(),
                    'maxStudents' => $lecturer->supervisions_quota ?? 0,
                ];
            });

        $filteredLecturers = Lecturer::with(['user', 'masterLecturer'])
            ->where('focus', $userFocus)
            ->get()
            ->map(function ($lecturer) {
                return [
                    'id' => $lecturer->lecturer_id,
                    'name' => $lecturer->user->name ?? $lecturer->masterLecturer->full_name ?? 'Unknown',
                    'expertise' => $lecturer->focus,
                    'currentStudents' => $lecturer->supervisions()->where('supervision_status', 'active')->count(),
                    'maxStudents' => $lecturer->supervisions_quota ?? 0,
                ];
            });

        $allStudents = Student::with(['user'])
            ->where('student_id', '!=', $currentStudent->student_id)
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->student_id,
                    'name' => $student->name ?? $student->user->name,
                    'nim' => $student->nim,
                    'interests' => $student->focus,
                ];
            });

        $filteredStudents = Student::with(['user'])
            ->where('student_id', '!=', $currentStudent->student_id)
            ->where('focus', $userFocus)
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->student_id,
                    'name' => $student->name ?? $student->user->name,
                    'nim' => $student->nim,
                    'interests' => $student->focus,
                ];
            });

        return Inertia::render('RegistrationPage', [
            'studentInfo' => [
                'name' => $currentStudent->name ?? $user->name,
                'nim' => $currentStudent->nim,
                'interests' => $currentStudent->focus,
            ],
            'allSupervisors' => $allLecturers,
            'filteredSupervisors' => $filteredLecturers,
            'allMembers' => $allStudents,
            'filteredMembers' => $filteredStudents,
            'institutions' => $institutions,
            'userFocus' => $userFocus,
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
                $newInst = Internship::firstOrCreate(
                    ['name' => $request->newInstitutionName],
                    [
                        'sector' => $request->newInstitutionSector,
                        'address' => $request->newInstitutionAddress,
                        'owner_name' => $request->newOwnerName,
                        'owner_email' => $request->newOwnerEmail,
                        'owner_phone' => $request->newOwnerPhone,
                    ]
                );

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

        if ($request->has('teamMembers') && is_array($request->teamMembers)) {
            if (count($request->teamMembers) > 3) {
                return redirect()->back()->with('error', 'Maksimal 4 anggota termasuk ketua.');
            }
        }

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
