<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Team;
use Inertia\Inertia;
use App\Models\Student;
use App\Models\Activity;
use App\Models\Lecturer;
use App\Models\Internship;
use App\Models\TeamMember;
use App\Models\Supervision;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

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

        // Kirim data institusi yang lebih lengkap
        $institutions = Internship::select(
            'internship_id',
            'name',
            'sector',
            'address',
            'owner_name',
            'owner_email',
            'owner_phone'
        )
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


        // Validasi end_date berdasarkan activity type
        $maxMonths = match ($request->activityType) {
            'pkl' => 3,
            'competition' => 2,
            'skripsi' => 6,
        };

        $maxEndDate = Carbon::parse($request->start_date)->addMonths($maxMonths);

        $request->validate([
            'activityType' => 'required|in:pkl,skripsi,competition',
            'start_date' => [
                'required',
                'date',
                'after_or_equal:today',
                'before_or_equal:' . now()->addDays(10)->format('Y-m-d')
            ],
            'end_date' => [
                'required',
                'date',
                'after:start_date',
                'before_or_equal:' . $maxEndDate->format('Y-m-d')
            ],
        ], [
            'start_date.after_or_equal' => 'Start date cannot be in the past.',
            'start_date.before_or_equal' => 'Start date must be within 10 days from today.',
            'end_date.after' => 'End date must be after start date.',
            'end_date.before_or_equal' => "End date cannot exceed $maxMonths months from start date.",
        ]);

        DB::beginTransaction();

        try {
            if ($request->activityType === 'skripsi') {
                $this->storeThesis($request, $student);
            } else {
                $this->storeTeamActivity($request, $student);
            }

            DB::commit();
            return redirect()->back()->with('success', 'Registration submitted successfully!');
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

        $activity = Activity::create([
            'activity_type_id' => 1,
            'title' => $request->title,
            'description' => $request->abstract,
            'start_date' => now(),
            'end_date' => Carbon::now()->addMonths(6),
        ]);

        Supervision::create([
            'student_id' => $student->student_id,
            'lecturer_id' => $request->mainSupervisor,
            'activity_id' => $activity->activity_id,
            'supervision_status' => 'pending',
            'assigned_date' => now(),
        ]);
    }

    private function storeTeamActivity($request, $student)
    {
        $typeId = $request->activityType === 'pkl' ? 2 : 3;

        $institutionId = null;

        if ($typeId === 2) {
            if ($request->boolean('isNewInstitution')) {
                $request->validate([
                    'newInstitutionName' => 'required|string|max:255',
                    'newInstitutionSector' => 'required|string|max:50',
                    'newOwnerName' => 'required|string|max:100',
                    'newOwnerEmail' => 'nullable|email|max:100',
                    'newOwnerPhone' => 'nullable|string|max:20',
                ]);

                $newInst = Internship::firstOrCreate(
                    [
                        'name' => $request->newInstitutionName,
                        'sector' => $request->newInstitutionSector,
                        'address' => $request->newInstitutionAddress,
                        'owner_name' => $request->newOwnerName,
                        'owner_email' => $request->newOwnerEmail,
                        'owner_phone' => $request->newOwnerPhone,
                    ]
                );

                $institutionId = $newInst->internship_id;
            } else {
                $request->validate([
                    'institution_id' => 'required|exists:internships,internship_id',
                ]);
                $institutionId = $request->institution_id;
            }
        }

        $request->validate([
            'supervisor' => 'required|exists:lecturers,lecturer_id',
        ]);

        $activity = Activity::create([
            'activity_type_id' => $typeId,
            'internship_id' => $institutionId,
            'title' => $request->activityType === 'pkl' ? 'PKL At - ' .  Internship::find($institutionId)?->name : $request->competitionName,
            'description' => $request->description ?? $request->competitionField,
            'start_date' => Carbon::createFromFormat('Y-m-d', $request->start_date)->format('Y-m-d'),
            'end_date'   => Carbon::createFromFormat('Y-m-d', $request->end_date)->format('Y-m-d'),
            'institution_id' => $institutionId,
        ]);

        // 2. Create Team
        $team = Team::create([
            'team_name'      => $request->activityType === 'pkl' ? 'PKL Team - ' . $student->name : 'Competition Team -' . $request->competitionName,
            'description'    => $activity->description,
        ]);

        TeamMember::create([
            'team_id' => $team->team_id,
            'student_id' => $student->student_id,
        ]);

        if (($request->has('teamMembers') && is_array($request->teamMembers) || ($request->has('competitionTeam') && is_array($request->competitionTeam)))) {

            if ($request->activityType === 'pkl') {
                if (count($request->teamMembers) > 3) {
                    return redirect()->back()->with('error', 'Maksimal 4 anggota termasuk ketua.');
                }

                foreach ($request->teamMembers as $memberId) {
                    TeamMember::create([
                        'team_id' => $team->team_id,
                        'student_id' => $memberId
                    ]);
                }
            } else if ($typeId === 3) {
                if (count($request->competitionTeam) > 3) {
                    return redirect()->back()->with('error', 'Maksimal 5 anggota termasuk ketua.');
                }

                foreach ($request->competitionTeam as $memberId) {
                    TeamMember::create([
                        'team_id' => $team->team_id,
                        'student_id' => $memberId
                    ]);
                }
            }
        }

        Supervision::create([
            'student_id' => $student->student_id,
            'lecturer_id' => $request->supervisor,
            'activity_id' => $activity->activity_id,
            'team_id' => $team->team_id ?? ' ',
            'supervision_status' => 'pending',
            'assigned_date' => now(),
        ]);
    }
}
