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
        try {
            $isStudent = $request->userType === 'student' || (!$request->has('department') && $request->userType !== 'lecturer');

            $maxNameLength = 50;
            $maxNimLength = 13;
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
                'email.required' => 'Email is required.',
                'email.email' => 'Please enter a valid email address.',
                'email.unique' => 'This email is already registered (Check both Student and Lecturer lists).',
                'name.required' => 'Full Name is required.',
                'name.regex' => 'Full Name must contain only letters and spaces.',
                'name.max' => "Full Name cannot exceed $maxNameLength characters.",
                'name.unique' => 'Full Name is already registered.',
                'nim.required' => 'NIM is required.',
                'nim.regex' => 'NIM must contain only numbers.',
                'nim.max' => "NIM cannot exceed $maxNimLength characters.",
                'nim.unique' => 'This NIM is already registered.',
                'nip.required' => 'NIP is required.',
                'nip.regex' => 'NIP must contain only numbers.',
                'nip.max' => "NIP cannot exceed $maxNipLength characters.",
                'nip.unique' => 'This NIP is already registered.',
                'supervision_quota.required' => 'Supervision quota is required.',
                'supervision_quota.integer' => 'Supervision quota must be a number.',
                'supervision_quota.min' => 'Supervision quota must be at least 0.',
            ];

            $validated = $request->validate($rules, $messages);

            $username = trim($isStudent ? $request->nim : $request->nip);
            $existingUser = User::withTrashed()->where('username', $username)->first();

            if ($existingUser && !$existingUser->trashed()) {
                return redirect()->back()->withErrors([
                    ($isStudent ? 'nim' : 'nip') => 'User account is already active.'
                ])->withInput();
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

        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                'error' => 'Failed to create user. Please try again.'
            ])->withInput();
        }
    }


    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $MAX_NAME_LENGTH = 50;
            $MAX_NIM_LENGTH = 13;
            $MAX_NIP_LENGTH = 18;

            $rules = [
                'name' => [
                    "required",
                    "regex:/^[A-Za-z\s]+$/",
                    "max:$MAX_NAME_LENGTH"
                ],
            ];

            $messages = [
                'name.required' => 'Full Name is required.',
                'name.regex' => 'Full Name must contain only letters and spaces.',
                'name.max' => "Full Name cannot exceed $MAX_NAME_LENGTH characters.",
                'email.required' => 'Email is required.',
                'email.email' => 'Please enter a valid email address.',
                'email.unique' => 'This email is already registered.',
                'nim.required' => 'NIM is required.',
                'nim.regex' => 'NIM must contain only numbers.',
                'nim.max' => "NIM cannot exceed $MAX_NIM_LENGTH characters.",
                'nim.unique' => 'This NIM is already registered.',
                'nip.required' => 'NIP is required.',
                'nip.regex' => 'NIP must contain only numbers.',
                'nip.max' => "NIP cannot exceed $MAX_NIP_LENGTH characters.",
                'nip.unique' => 'This NIP is already registered.',
                'supervision_quota.required' => 'Supervision quota is required.',
                'supervision_quota.integer' => 'Supervision quota must be a number.',
                'supervision_quota.min' => 'Supervision quota must be at least 0.',
            ];

            if ($user->role_name === 'dosen') {
                $lecturer = $user->lecturer;
                $masterLecturer = $lecturer->masterLecturer;

                $old_email = $masterLecturer->email;
                $new_email = $request->input('email');

                if ($old_email != $new_email) {
                    $rules['email'] = 'required|email|max:255|unique:master_lecturers,email';
                } else {
                    $rules['email'] = 'required|email|max:255';
                }

                $old_NIP = $masterLecturer->nip;
                $new_NIP = $request->input('nip');

                if ($old_NIP != $new_NIP) {
                    $rules['nip'] = [
                        "required",
                        "string",
                        "regex:/^[0-9]+$/",
                        "max:$MAX_NIP_LENGTH",
                        "unique:master_lecturers,nip,{$masterLecturer->master_lecturer_id},master_lecturer_id",
                        "unique:master_students,nim"
                    ];
                } else {
                    $rules['nip'] = 'required|string|max:255';
                }

                $rules['supervision_quota'] = 'required|integer|min:0';

                $validated = $request->validate($rules, $messages);

                $lecturer->supervision_quota = $validated['supervision_quota'];

                $masterLecturer->full_name = $validated['name'];
                $masterLecturer->nip = $validated['nip'];
                $masterLecturer->email = $validated['email'];

                if ($lecturer->isDirty()) {
                    $lecturer->save();
                }

                if ($masterLecturer->isDirty()) {
                    $masterLecturer->save();
                }

            } else if ($user->role_name === 'mahasiswa') {
                $student = $user->student;
                $masterStudent = $student->masterStudent;

                $old_email = $masterStudent->email;
                $new_email = $request->input('email');

                if ($old_email != $new_email) {
                    $rules['email'] = 'required|email|max:255|unique:master_students,email';
                } else {
                    $rules['email'] = 'required|email|max:255';
                }

                $old_NIM = $masterStudent->nim;
                $new_NIM = $request->input('nim');

                if ($old_NIM != $new_NIM) {
                    $rules['nim'] = [
                        "required",
                        "string",
                        "regex:/^[0-9]+$/",
                        "max:$MAX_NIM_LENGTH",
                        "unique:master_students,nim,{$masterStudent->master_student_id},master_student_id",
                        "unique:master_lecturers,nip"
                    ];
                } else {
                    $rules['nim'] = 'required|string|max:255';
                }

                $validated = $request->validate($rules, $messages);

                $masterStudent->full_name = $validated['name'];
                $masterStudent->nim = $validated['nim'];
                $masterStudent->email = $validated['email'];

                if ($masterStudent->isDirty()) {
                    $masterStudent->save();
                }
            }

            return redirect()->route('admin.users')->with('success', 'User updated successfully');

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return redirect()->back()->withErrors([
                'error' => 'User not found.'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                'error' => 'Failed to update user. Please try again.'
            ])->withInput();
        }
    }

    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);

            DB::transaction(function () use ($user) {
                $user->delete();

                if ($user->role_name === 'dosen') {
                    $lecturer = $user->lecturer;

                    if ($lecturer) {
                        $masterLecturer = $lecturer->masterLecturer;
                        $lecturer->delete();

                        if ($masterLecturer) {
                            $masterLecturer->delete();
                        }
                    }

                } elseif ($user->role_name === 'mahasiswa') {
                    $student = $user->student;

                    if ($student) {
                        $masterStudent = $student->masterStudent;
                        $student->delete();

                        if ($masterStudent) {
                            $masterStudent->delete();
                        }
                    }
                }
            });

            return redirect()->route('admin.users')->with('success', 'User dan data terkait berhasil dinonaktifkan (Soft Delete).');

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return redirect()->back()->withErrors([
                'error' => 'User not found.'
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                'error' => 'Failed to delete user. Please try again.'
            ]);
        }
    }

    public function toggleStatus($id)
    {
        try {
            $user = User::find($id);

            if (!$user) {
                return redirect()->back()->withErrors([
                    'error' => 'User not found.'
                ]);
            }

            if ($user->role->role_name === 'mahasiswa') {
                $student = $user->student->masterStudent;
                $student->is_active = !($student->is_active);
                $student->save();
            } else if ($user->role->role_name === 'dosen') {
                $lecturer = $user->lecturer->masterLecturer;
                $lecturer->is_active = !($lecturer->is_active);
                $lecturer->save();
            }

            return redirect()->route('admin.users')->with('success', 'Status updated successfully');

        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                'error' => 'Failed to update status. Please try again.'
            ]);
        }
    }
}
