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
            return redirect()->route('dashboard')->with('error', 'Special page for students.');
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
            ->whereHas('masterLecturer', function ($q) {
                $q->where('is_active', true);
            })
            ->get()
            ->map(function ($lecturer) {
                return [
                    'id' => $lecturer->lecturer_id,
                    'name' => $lecturer->user->name ?? $lecturer->masterLecturer->full_name ?? 'Unknown',
                    'expertise' => $lecturer->focus,
                    'currentStudents' => $lecturer->supervisions()->where('supervision_status', 'approved')->count(),
                    'maxStudents' => $lecturer->supervision_quota ?? 0,
                ];
            })
            ->filter(function ($lec) {
                return $lec['currentStudents'] < $lec['maxStudents'];
            })

            ->values();

        $filteredLecturers = Lecturer::with(['user', 'masterLecturer'])
            ->whereHas('masterLecturer', function ($q) {
                $q->where('is_active', true);
            })
            ->where('focus', $userFocus)
            ->get()
            ->map(function ($lecturer) {
                return [
                    'id' => $lecturer->lecturer_id,
                    'name' => $lecturer->user->name ?? $lecturer->masterLecturer->full_name ?? 'Unknown',
                    'expertise' => $lecturer->focus,
                    'currentStudents' => $lecturer->supervisions()->where('supervision_status', 'approved')->count(),
                    'maxStudents' => $lecturer->supervision_quota ?? 0,
                ];
            });

        $allStudents = Student::with(['user'])
            ->where('student_id', '!=', $currentStudent->student_id)
            ->whereHas('masterStudent', function ($q) {
                $q->where('is_active', true);
            })
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->student_id,
                    'name' => $student->name ?? $student->user->name,
                    'nim' => $student->nim,
                    'interests' => $student->focus,
                    'internship_status' => $this->getStudentActivityStatus($student->student_id, 2)
                ];
            });

        $filteredStudents = Student::with(['user'])
            ->where('student_id', '!=', $currentStudent->student_id)
            ->whereHas('masterStudent', function ($q) {
                $q->where('is_active', true);
            })
            ->where('focus', $userFocus)
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->student_id,
                    'name' => $student->name ?? $student->user->name,
                    'nim' => $student->nim,
                    'interests' => $student->focus,
                    'internship_status' => $this->getStudentActivityStatus($student->student_id, 2)
                ];
            });

        return Inertia::render('RegistrationPage', [
            'studentInfo' => [
                'name' => $currentStudent->name ?? $user->name,
                'nim' => $currentStudent->nim,
                'interests' => $currentStudent->focus,
                'thesis_status' => $this->getStudentActivityStatus($currentStudent->student_id, 1),
                'internship_status' => $this->getStudentActivityStatus($currentStudent->student_id, 2)
            ],
            'allSupervisors' => $allLecturers,
            'filteredSupervisors' => $filteredLecturers,
            'allMembers' => $allStudents,
            'filteredMembers' => $filteredStudents,
            'institutions' => $institutions,
            'userFocus' => $userFocus,
        ]);
    }

    protected function getStudentActivityStatus(string $id, string $type)
    {
        $leader = Supervision::whereHas('activity', function ($q) use ($type) {
            $q->where('activity_type_id', $type);
        })
            ->where('student_id', $id)
            ->latest('assigned_at')
            ->first();


        $member = Supervision::whereHas('activity', function ($q) use ($type) {
            $q->where('activity_type_id', $type);
        })
            ->whereHas('team.members', function ($q) use ($id) {
                $q->where('student_id', $id);
            })
            ->latest('assigned_at')
            ->first();

        $activity = $leader ?? $member;

        return $activity ? $activity->supervision_status : ' ';
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $student = $user->student;

        // Validasi end_date berdasarkan activity type
        $maxMonths = match ($request->activityType) {
            'Internship' => 3,
            'Competition' => 2,
            'Thesis' => 6,
        };

        $maxEndDate = Carbon::parse($request->start_date)->addMonths($maxMonths);

        $request->validate([
            'activityType' => 'required|in:Internship,Thesis,Competition'
        ]);

        DB::beginTransaction();

        try {
            if ($request->activityType === 'Thesis') {
                $this->storeThesis($request, $student);
            } else {
                $request->validate([
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
                $this->storeTeamActivity($request, $student);
            }

            DB::commit();
            return redirect()->route('application.status')->with('success', 'Registration submitted successfully!');
        }
        catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to submit registration: ' . $e -> getMessage())->withInput();
        }
    }


    private function storeThesis($request, $student)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'abstract' => 'required|string|min:50',
            'researchTopics' => 'required|array|min:1',
            'mainSupervisor' => 'required|exists:lecturers,lecturer_id',
        ], [
            'title.required' => 'Thesis title is required.',
            'title.max' => 'Thesis title must not exceed 255 characters.',
            'abstract.required' => 'Abstract is required.',
            'abstract.min' => 'Abstract must be at least 50 characters.',
            'researchTopics.required' => 'Please select at least one research topic.',
            'researchTopics.min' => 'Please select at least one research topic.',
            'mainSupervisor.required' => 'Please select a thesis supervisor.',
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
            'assigned_at' => now(),
        ]);
    }

    private function storeTeamActivity($request, $student)
    {
        $typeId = $request->activityType === 'Internship' ? 2 : 3;

        $institutionId = null;

        if ($typeId === 2) {
            if ($request->boolean('isNewInstitution')) {
                $request->validate([
                    'newInstitutionName' => 'required|string|max:255',
                    'newInstitutionSector' => 'required|string|max:50',
                    'newOwnerName' => 'required|string|max:100',
                    'newInstitutionAddress' => 'nullable|string|max:500',
                    'newOwnerEmail' => 'nullable|email|max:100',
                    'newOwnerPhone' => 'nullable|string|max:20',
                ], [
                    'newInstitutionName.required' => 'Company name is required.',
                    'newInstitutionSector.required' => 'Sector is required.',
                    'newOwnerName.required' => 'Owner/Mentor name is required.',
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
                ], [
                    'institution_id.required' => 'Please select an institution.',
                ]);
                $institutionId = $request->institution_id;
            }

            $request->validate([
                'supervisor' => 'required|exists:lecturers,lecturer_id',
                'description' => 'required|string|min:20',
            ], [
                'supervisor.required' => 'Please select a supervisor.',
                'description.required' => 'Internship description is required.',
                'description.min' => 'Description must be at least 20 characters.',
            ]);
        }

        if ($typeId === 3) {
            $request->validate([
                'competitionName' => 'required|string|max:255',
                'competitionField' => 'required|string',
                'competitionSupervisor' => 'required|exists:lecturers,lecturer_id',
            ], [
                'competitionName.required' => 'Competition name is required.',
                'competitionField.required' => 'Please select a competition field.',
                'competitionSupervisor.required' => 'Please select a supervisor.',
            ]);
        }

        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ], [
        ]);

        $additionalMembers = [];
        if ($request->activityType === 'Internship' && $request->has('teamMembers')) {
            $additionalMembers = $request->teamMembers;
        } elseif ($typeId === 3 && $request->has('competitionTeam')) {
            $additionalMembers = $request->competitionTeam;
        }

        if (!is_array($additionalMembers)) {
            $additionalMembers = [];
        }

        if (count($additionalMembers) > 3) {
            throw new \Exception('A maximum of 4 members, including the leader.');
        }

        $teamId = null;

        $activity = Activity::create([
            'activity_type_id' => $typeId,
            'internship_id' => $institutionId,
            'title' => $request->activityType === 'Internship' ? 'Internship At - ' .  Internship::find($institutionId)?->name : $request->competitionName,
            'description' => $request->description ?? $request->competitionField,
            'start_date' => Carbon::createFromFormat('Y-m-d', $request->start_date)->format('Y-m-d'),
            'end_date'   => Carbon::createFromFormat('Y-m-d', $request->end_date)->format('Y-m-d'),
            'institution_id' => $institutionId,
        ]);

        if (!empty($additionalMembers)) {
            $team = Team::create([
                'team_name'   => $request->activityType === 'Internship' ? 'Internship Team - ' . $student->name : 'Competition Team - ' . $request->competitionName,
                'description' => $activity->description,
            ]);

            $teamId = $team->team_id;

            TeamMember::create([
                'team_id'    => $teamId,
                'student_id' => $student->student_id,
            ]);

            foreach ($additionalMembers as $memberId) {
                if ($memberId == $student->student_id) continue;

                TeamMember::create([
                    'team_id'    => $teamId,
                    'student_id' => $memberId,
                ]);
            }
        }

        Supervision::create([
            'student_id' => $student->student_id,
            'lecturer_id' => $request->supervisor ?? $request -> competitionSupervisor,
            'activity_id' => $activity->activity_id,
            'team_id' =>    $teamId,
            'supervision_status' => 'pending',
            'assigned_at' => now(),
        ]);
    }
}
