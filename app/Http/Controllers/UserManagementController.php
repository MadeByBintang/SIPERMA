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
    public function index()
    {
        $students = Student::all()->map(function ($student) {
            return [
                'id' => $student->user->user_id,
                'name' => $student->name,
                'email' => $student->email,
                'nim' => $student->nim,
                'status' => $student->status ? 'active' : 'inactive',
            ];
        });

        $lecturers = Lecturer::all()->map(function ($lecturer) {
            return [
                'id' => $lecturer->user->user_id,
                'name' => $lecturer->name,
                'email' => $lecturer->email,
                'nip'   => $lecturer->nip,
                'status' => $lecturer->status ? 'active' : 'inactive',
                'supervision_quota' => $lecturer->supervision_quota,
            ];
        });

        return Inertia::render('UserManagementPage', [
            'all_student' => $students,
            'all_lecturer' => $lecturers,
        ]);
    }

    public function store(Request $request)
    {

        $isStudent = $request->userType === 'student' || (!$request->has('department') && $request->userType !== 'lecturer');

        $maxNameLength = 50;
        $maxNimLength = 15;
        $maxNipLength = 18;

        $rules = [
            'email' => [
                'required',
                'email',
                'unique:master_students,email',
                'unique:master_lecturers,email'
            ],
            'name' => [
                'required',
                "regex:/^[A-Za-z\s]+$/",
                "max:$maxNameLength",
                'unique:master_students,full_name',
                'unique:master_lecturers,full_name'
            ],
        ];

        if ($isStudent) {
            $rules['nim'] = [
                'required',
                'string',
                "regex:/^[0-9]+$/",
                "max:$maxNimLength",
                'unique:master_students,nim',
                'unique:master_lecturers,nip',
                'unique:users,username'
            ];
        } else {
            $rules['nip'] = [
                'required',
                'string',
                "regex:/^[0-9]+$/",
                "max:$maxNipLength",
                'unique:master_lecturers,nip',
                'unique:master_students,nim',
                'unique:users,username'
            ];
            $rules['supervision_quota'] = 'required|integer|min:0';
        }

        $messages = [
            'email.unique' => 'This email is already registered (Check both Student and Lecturer lists).',
            'name.regex' => 'Full Name must contain only letters and spaces.',
            'name.max' => "Full Name cannot exceed $maxNameLength characters.",
            'name.unique' => 'Full Name is already registered.',
            'nim.regex' => 'NIM must contain only numbers.',
            'nim.max' => "NIM cannot exceed $maxNimLength characters.",
            'nip.regex' => 'NIP must contain only numbers.',
            'nip.max' => "NIP cannot exceed $maxNipLength characters.",
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
                    'is_active' => true,
                ]);
                $masterId = $master->master_student_id;
            } else {
                $master = MasterLecturer::create([
                    'nip' => $username,
                    'full_name' => $request->name,
                    'email' => $request->email,
                    'is_active' => true,
                ]);
                $masterId = $master->master_lecturer_id;
            }

            if ($existingUser && $existingUser->trashed()) {
                $existingUser->restore();
                $existingUser->password = Hash::make('password');
                $existingUser->role_id = $role->role_id;
                $existingUser->save();
                $user = $existingUser;
            } else {
                $user = User::create([
                    'username' => $username,
                    'password' => Hash::make('password'),
                    'role_id' => $role->role_id,
                ]);
            }

            if ($isStudent) {
                Student::updateOrCreate([
                    'user_id' => $user->user_id,
                    'master_student_id' => $masterId,
                    'focus' => null
                ]);
            } else {
                Lecturer::updateOrCreate([
                    'user_id' => $user->user_id,
                    'master_lecturer_id' => $masterId,
                    'supervision_quota' => $request->supervision_quota
                ]);
            }
        });

        return redirect()->route('admin.users')->with('success', 'User created successfully.');
    }

    public function update(Request $request, $id)
    {
        // 1. Handle Edit Master Only
        $maxNameLength = 50;
        $maxNimLength = 15;
        $maxNipLength = 18;
        if (!is_numeric($id)) {
            $parts = explode('-', $id);
            $prefix = $parts[0];
            $masterId = $parts[1];

            if ($prefix === 'mstu') {
                $request->validate([
                    'email' => ["required", "email", "unique:master_students,email,{$masterId},master_student_id", "unique:master_lecturers,email"],
                    'name' => ["required", "regex:/^[A-Za-z\s]+$/", "max:$maxNameLength"],
                    'nim' => ["required", "string", "regex:/^[0-9]+$/", "max:$maxNimLength", "unique:master_students,nim,{$masterId},master_student_id", "unique:master_lecturers,nip"],
                    'full_name' => ["required", "regex:/^[A-Za-z\s]+$/", "max:$maxNameLength", "unique:master_students,full_name,{$masterId},master_student_id"]
                ], [
                    'name.regex' => 'Full Name must contain only letters and spaces.',
                    'name.max' => "Full Name cannot exceed $maxNameLength characters.",
                    'nim.regex' => 'NIM must contain only numbers.',
                    'nim.max' => "NIM cannot exceed $maxNimLength characters."
                ]);
                MasterStudent::where('master_student_id', $masterId)->update([
                    'full_name' => $request->name,
                    'email' => $request->email,
                    'nim' => trim($request->nim)
                ]);
            } else {
                $request->validate([
                    'email' => ["required", "email", "unique:master_lecturers,email,{$masterId},master_lecturer_id", "unique:master_students,email"],
                    'name' => ["required", "regex:/^[A-Za-z\s]+$/", "max:$maxNameLength"],
                    'nip' => ["required", "string", "regex:/^[0-9]+$/", "max:$maxNipLength", "unique:master_lecturers,nip,{$masterId},master_lecturer_id", "unique:master_students,nim"],
                    'full_name' => ["required", "regex:/^[A-Za-z\s]+$/", "max:$maxNameLength", "unique:master_lecturers,full_name,{$masterId},master_lecturer_id"]
                ], [
                    'name.regex' => 'Full Name must contain only letters and spaces.',
                    'name.max' => "Full Name cannot exceed $maxNameLength characters.",
                    'nip.regex' => 'NIP must contain only numbers.',
                    'nip.max' => "NIP cannot exceed $maxNipLength characters."
                ]);
                MasterLecturer::where('master_lecturer_id', $masterId)->update([
                    'full_name' => $request->name,
                    'email' => $request->email,
                    'nip' => trim($request->nip)
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

        $rules = [
            'name' => [
                'required',
                "regex:/^[A-Za-z\s]+$/",
                "max:$maxNameLength"
            ],
            'full_name' => [
                'required',
                "regex:/^[A-Za-z\s]+$/",
                "max:$maxNameLength",
                $isStudent
                    ? "unique:master_students,full_name,{$ignoreId},master_student_id"
                    : "unique:master_lecturers,full_name,{$ignoreId},master_lecturer_id",
            ],
        ];

        if (!$isStudent) {
            // Rules Dosen
            $rules['nip'] = [
                'required',
                'string',
                'regex:/^[0-9]+$/',
                "max:$maxNipLength",
                "unique:master_lecturers,nip,{$ignoreId},master_lecturer_id",
                "unique:users,username,{$user->user_id},user_id",
                "unique:master_students,nim" // Cek silang ID
            ];
            $rules['email'] = [
                'required',
                'email',
                "unique:master_lecturers,email,{$ignoreId},master_lecturer_id",
                "unique:master_students,email" // Cek silang Email
            ];
            $rules['supervision_quota'] = 'required|integer|min:0|max:20';
        } else {
            // Rules Mahasiswa
            $rules['nim'] = [
                'required',
                'string',
                'regex:/^[0-9]+$/',
                "max:$maxNimLength",
                "unique:master_students,nim,{$ignoreId},master_student_id",
                "unique:users,username,{$user->user_id},user_id",
                "unique:master_lecturers,nip" // Cek silang ID
            ];
            $rules['email'] = [
                'required',
                'email',
                "unique:master_students,email,{$ignoreId},master_student_id",
                "unique:master_lecturers,email" // Cek silang Email
            ];
        }

        $messages = [
            'name.regex' => 'Full Name must contain only letters and spaces.',
            'name.max' => "Full Name cannot exceed $maxNameLength characters.",
            'full_name.unique' => 'Full Name is already registered.',
            'email.unique' => 'Email is already taken by another account (Student/Lecturer).',
            'nim.regex' => 'NIM must contain only numbers.',
            'nim.max' => "NIM cannot exceed $maxNimLength characters.",
            'nip.regex' => 'NIP must contain only numbers.',
            'nip.max' => "NIP cannot exceed $maxNipLength characters.",
            'supervision_quota.min' => 'Supervision quota cannot be negative.',
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
        $user = User::find($id);

        if ($user->role->role_name === 'mahasiswa') {
            $student = $user->student->masterStudent;
            $student->is_active = !($student->is_active);
            $student->save();
        } else if ($user->role->role_name === 'dosen') {
            $lecturer = $user->lecturer->masterLecturer;
            $lecturer->is_active = !($lecturer->is_active);
            $lecturer->save();
        }

        return redirect()->route('admin.users')->with('success', 'Status updated');
    }
}
