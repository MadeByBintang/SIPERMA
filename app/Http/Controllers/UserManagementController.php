<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\Student;
use App\Models\Lecturer;
use App\Models\MasterStudent;
use App\Models\MasterLecturer;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        // 1. Master Students
        $masterStudentsQuery = MasterStudent::query();
        if ($search) {
            $masterStudentsQuery->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('nim', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        $masterStudents = $masterStudentsQuery->orderBy('full_name')->get();

        // 2. Master Lecturers
        $masterLecturersQuery = MasterLecturer::query();
        if ($search) {
            $masterLecturersQuery->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('nip', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        $masterLecturers = $masterLecturersQuery->orderBy('full_name')->get();

        // 3. Mapping Users
        $studentUsernames = $masterStudents->pluck('nim')->filter()->unique()->values()->all();
        $lecturerUsernames = $masterLecturers->pluck('nip')->filter()->unique()->values()->all();
        $allUsernames = array_merge($studentUsernames, $lecturerUsernames);

        $usersByUsername = User::with('lecturer')
            ->whereIn('username', $allUsernames)
            ->get()
            ->keyBy('username');

        // 4. Students List
        $students = $masterStudents->map(function ($m) use ($usersByUsername) {
            $user = $usersByUsername->get(trim($m->nim));
            $isRegistered = $user !== null;
            return [
                'id' => $isRegistered ? (string) $user->user_id : 'mstu-' . $m->master_student_id,
                'nim' => $m->nim ?? '-',
                'name' => $m->full_name ?? ($m->name ?? '-'),
                'email' => $m->email ?? '-',
                'status' => ($m->is_active ? 'active' : 'inactive'),
                'has_user_account' => $isRegistered,
            ];
        })->values()->all();

        // 5. Lecturers List
        $lecturers = $masterLecturers->map(function ($m) use ($usersByUsername) {
            $user = $usersByUsername->get(trim($m->nip));
            $isRegistered = $user !== null;
            $quota = ($isRegistered && $user->lecturer) ? $user->lecturer->supervision_quota : 0;
            $expertise = !empty($m->expertise) ? array_map('trim', explode(',', $m->expertise)) : [];

            return [
                'id' => $isRegistered ? (string) $user->user_id : 'mlec-' . $m->master_lecturer_id,
                'nip' => $m->nip ?? '-',
                'name' => $m->full_name ?? ($m->name ?? '-'),
                'email' => $m->email ?? '-',
                'status' => ($m->is_active ? 'active' : 'inactive'),
                'supervision_quota' => $quota,
                'expertise' => $expertise,
                'has_user_account' => $isRegistered,
            ];
        })->values()->all();

        return Inertia::render('UserManagementPage', [
            'students' => $students,
            'lecturers' => $lecturers,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $isStudent = $request->userType === 'student' || (!$request->has('department') && $request->userType !== 'lecturer');
        
        $rules = [
            'supervision_quota' => !$isStudent ? 'required|integer|min:0|max:20' : 'nullable',
        ];

        if ($isStudent) {
            // Rules untuk Student
            $rules['nim'] = [
                'required', 'string', 'regex:/^[0-9]+$/', 
                'unique:master_students,nim', 
                'unique:master_lecturers,nip', // Cek silang ke Dosen (ID)
                'unique:users,username'
            ];
            // Rules Email (Cek di kedua tabel)
            $rules['email'] = [
                'required', 'email', 
                'unique:master_students,email', 
                'unique:master_lecturers,email' // Cek silang ke email Dosen
            ];
        } else {
            // Rules untuk Lecturer
            $rules['nip'] = [
                'required', 'string', 'regex:/^[0-9]+$/', 
                'unique:master_lecturers,nip', 
                'unique:master_students,nim', // Cek silang ke Mahasiswa (ID)
                'unique:users,username'
            ];
            // Rules Email (Cek di kedua tabel)
            $rules['email'] = [
                'required', 'email', 
                'unique:master_lecturers,email', 
                'unique:master_students,email' // Cek silang ke email Mahasiswa
            ];
        }

        $messages = [
            'email.unique' => 'This email is already registered (Check both Student and Lecturer lists).',
            'nim.regex' => 'NIM must contain only numbers.',
            'nip.regex' => 'NIP must contain only numbers.',
            'nim.unique' => 'This NIM is already registered.',
            'nip.unique' => 'This NIP is already registered.',
            'users.unique' => 'This ID is already in use by another account.',
            'master_lecturers.unique' => 'This ID/Email is already registered as a Lecturer.',
            'master_students.unique'  => 'This ID/Email is already registered as a Student.',
        ];

        $request->validate($rules, $messages);

        $username = trim($isStudent ? $request->nim : $request->nip);
        $existingUser = User::withTrashed()->where('username', $username)->first();

        if ($existingUser && !$existingUser->trashed()) {
            return redirect()->back()->withErrors([($isStudent ? 'nim' : 'nip') => 'User account is already active.']);
        }

        DB::transaction(function () use ($request, $isStudent, $username, $existingUser) {
            $roleName = $isStudent ? 'mahasiswa' : 'dosen';
            $role = Role::where('role_name', $roleName)->firstOrFail();
            
            if ($isStudent) {
                $master = MasterStudent::create([
                    'nim' => $username,
                    'full_name' => $request->name,
                    'email' => $request->email,
                    'year' => $request->year ?? null,
                    'is_active' => true,
                ]);
                $masterId = $master->master_student_id;
            } else {
                $master = MasterLecturer::create([
                    'nip' => $username,
                    'full_name' => $request->name,
                    'email' => $request->email,
                    'department' => $request->department ?? null,
                    'is_active' => true,
                ]);
                $masterId = $master->master_lecturer_id;
            }

            if ($existingUser && $existingUser->trashed()) {
                $existingUser->restore();
                $existingUser->password = Hash::make('password123');
                $existingUser->role_id = $role->role_id;
                $existingUser->save();
                $user = $existingUser;
            } else {
                $user = User::create([
                    'username' => $username,
                    'password' => Hash::make('password123'),
                    'role_id' => $role->role_id,
                ]);
            }

            if ($isStudent) {
                Student::updateOrCreate(
                    ['user_id' => $user->user_id],
                    ['master_student_id' => $masterId, 'year' => $request->year ?? 2023, 'enrollment_date' => now()]
                );
            } else {
                Lecturer::updateOrCreate(
                    ['user_id' => $user->user_id],
                    [
                        'master_lecturer_id' => $masterId, 
                        'hire_date' => now(),
                        'supervision_quota' => $request->supervision_quota 
                    ]
                );
            }
        });

        return redirect()->route('admin.users')->with('success', 'User created successfully.');
    }

    public function update(Request $request, $id)
    {
        // 1. Handle Edit Master Only
        if (!is_numeric($id)) {
            $parts = explode('-', $id);
            $prefix = $parts[0];
            $masterId = $parts[1];
            
            if ($prefix === 'mstu') {
                $request->validate([
                    'email' => ["required", "email", "unique:master_students,email,{$masterId},master_student_id", "unique:master_lecturers,email"],
                    'nim' => ["required", "string", "regex:/^[0-9]+$/", "unique:master_students,nim,{$masterId},master_student_id", "unique:master_lecturers,nip"]
                ]);
                MasterStudent::where('master_student_id', $masterId)->update([
                    'full_name' => $request->name, 'email' => $request->email, 'nim' => trim($request->nim)
                ]);
            } else {
                $request->validate([
                    'email' => ["required", "email", "unique:master_lecturers,email,{$masterId},master_lecturer_id", "unique:master_students,email"],
                    'nip' => ["required", "string", "regex:/^[0-9]+$/", "unique:master_lecturers,nip,{$masterId},master_lecturer_id", "unique:master_students,nim"]
                ]);
                MasterLecturer::where('master_lecturer_id', $masterId)->update([
                    'full_name' => $request->name, 'email' => $request->email, 'nip' => trim($request->nip)
                ]);
            }
            return redirect()->route('admin.users')->with('success', 'Master data updated successfully.');
        }

        // 2. Handle Edit User Biasa
        $user = User::findOrFail($id);
        $roleName = strtolower($user->getRoleNameAttribute() ?? '');
        $isStudent = ($roleName === 'mahasiswa');
        
        $ignoreId = 0;
        if ($isStudent && $user->student) $ignoreId = $user->student->master_student_id ?? 0;
        elseif (!$isStudent && $user->lecturer) $ignoreId = $user->lecturer->master_lecturer_id ?? 0;

        $rules = [];

        if (!$isStudent) {
            // Rules Dosen
            $rules['nip'] = [
                'required', 'string', 'regex:/^[0-9]+$/', 
                "unique:master_lecturers,nip,{$ignoreId},master_lecturer_id",
                "unique:users,username,{$user->user_id},user_id",
                "unique:master_students,nim" // Cek silang ID
            ];
            $rules['email'] = [
                'required', 'email',
                "unique:master_lecturers,email,{$ignoreId},master_lecturer_id",
                "unique:master_students,email" // Cek silang Email
            ];
            $rules['supervision_quota'] = 'required|integer|min:0|max:20';
        } else {
            // Rules Mahasiswa
            $rules['nim'] = [
                'required', 'string', 'regex:/^[0-9]+$/', 
                "unique:master_students,nim,{$ignoreId},master_student_id",
                "unique:users,username,{$user->user_id},user_id",
                "unique:master_lecturers,nip" // Cek silang ID
            ];
            $rules['email'] = [
                'required', 'email',
                "unique:master_students,email,{$ignoreId},master_student_id",
                "unique:master_lecturers,email" // Cek silang Email
            ];
        }

        $messages = [
            'email.unique' => 'Email is already taken by another account (Student/Lecturer).',
            'nim.regex' => 'NIM must contain only numbers.',
            'nip.regex' => 'NIP must contain only numbers.',
            'nim.unique' => 'NIM is already taken.',
            'nip.unique' => 'NIP is already taken.',
            'master_lecturers.unique' => 'This ID/Email is already registered as a Lecturer.',
            'master_students.unique' => 'This ID/Email is already registered as a Student.',
        ];

        $request->validate($rules, $messages);

        DB::transaction(function () use ($request, $user, $isStudent) {
            if ($isStudent && $user->student && $user->student->masterStudent) {
                $user->student->masterStudent->update([
                    'full_name' => $request->name,
                    'email' => $request->email,
                    'nim' => trim($request->nim),
                ]);
                if ($request->nim !== $user->username) $user->update(['username' => trim($request->nim)]);

            } elseif (!$isStudent && $user->lecturer && $user->lecturer->masterLecturer) {
                $user->lecturer->masterLecturer->update([
                    'full_name' => $request->name,
                    'email' => $request->email,
                    'nip' => trim($request->nip),
                ]);
                $user->lecturer->update([
                    'supervision_quota' => $request->supervision_quota
                ]);
                if ($request->nip !== $user->username) $user->update(['username' => trim($request->nip)]);
            }
        });

        return redirect()->route('admin.users')->with('success', 'User updated successfully');
    }

    public function destroy($id)
    {
        try {
            DB::transaction(function () use ($id) {
                if (!is_numeric($id)) {
                    $parts = explode('-', $id);
                    $prefix = $parts[0];
                    $masterId = (int) $parts[1];

                    if ($prefix === 'mstu') {
                        DB::table('students')->where('master_student_id', $masterId)->delete();
                        DB::table('master_students')->where('master_student_id', $masterId)->delete();
                    } elseif ($prefix === 'mlec') {
                        DB::table('lecturers')->where('master_lecturer_id', $masterId)->delete();
                        DB::table('master_lecturers')->where('master_lecturer_id', $masterId)->delete();
                    }
                    return;
                }

                $user = User::with(['role', 'student', 'lecturer'])->findOrFail($id);
                if ($user->user_id === Auth::user()->user_id) throw new \Exception('Cannot delete your own account.');

                $roleName = strtolower($user->getRoleNameAttribute() ?? '');
                
                if ($roleName === 'mahasiswa') {
                    $masterId = $user->student->master_student_id ?? null;
                    DB::table('students')->where('user_id', $user->user_id)->delete();
                    if ($masterId) DB::table('master_students')->where('master_student_id', $masterId)->delete();
                } elseif ($roleName === 'dosen') {
                    $masterId = $user->lecturer->master_lecturer_id ?? null;
                    DB::table('lecturers')->where('user_id', $user->user_id)->delete();
                    if ($masterId) DB::table('master_lecturers')->where('master_lecturer_id', $masterId)->delete();
                }

                $user->forceDelete(); 
            });
            return redirect()->back()->with('success', 'Data deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Delete failed: ' . $e->getMessage());
        }
    }

    public function toggleStatus($id)
    {
        $masterRecord = null;
        if (!is_numeric($id)) {
            $parts = explode('-', $id);
            $prefix = $parts[0];
            $masterId = $parts[1];
            if ($prefix === 'mstu') $masterRecord = MasterStudent::find($masterId);
            elseif ($prefix === 'mlec') $masterRecord = MasterLecturer::find($masterId);
        } else {
            $user = User::with(['role', 'student.masterStudent', 'lecturer.masterLecturer'])->find($id);
            if ($user) {
                if ($user->user_id === Auth::user()->user_id) return redirect()->back()->with('error', 'Cannot deactivate your own account.');
                $roleName = strtolower($user->getRoleNameAttribute() ?? '');
                if ($roleName === 'mahasiswa' && $user->student) $masterRecord = $user->student->masterStudent;
                elseif ($roleName === 'dosen' && $user->lecturer) $masterRecord = $user->lecturer->masterLecturer;
            }
        }

        if ($masterRecord) {
            $newStatus = !(bool)$masterRecord->is_active;
            $masterRecord->forceFill(['is_active' => $newStatus])->save();
            return redirect()->back()->with('success', "Status updated.");
        }
        return redirect()->back()->with('error', 'Failed to toggle status.');
    }
}