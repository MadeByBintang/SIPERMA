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


    public function update(Request $request, $id){
        $user = User::findOrFail($id);

        $MAX_NAME_LENGTH = 50;
        $MAX_NIM_LENGTH = 13;
        $MAX_NIP_LENGTH = 18;

        $rules = [
            'name' => ["required", "regex:/^[A-Za-z\s]+$/", "max:$MAX_NAME_LENGTH"],
        ];

        if ($user -> role_name === 'dosen'){
            $lecturer = $user -> lecturer;
            $masterLecturer = $lecturer -> masterLecturer;

            $old_email = $masterLecturer -> email;
            $new_email = $request -> input('email');

            if ($old_email != $new_email) {
                $rules['email'] = 'required|string|max:255|unique:master_lecturers,email';
            } else {
                $rules['email'] = 'required|string|max:255';
            }

            $old_NIP = $masterLecturer -> nip;
            $new_NIP = $request -> input('nip');

            if ($old_NIP != $new_NIP) {
                $rules['nip'] = ["required", "string", "regex:/^[0-9]+$/", "max:$MAX_NIP_LENGTH", "unique:master_lecturers,nip,{$masterLecturer -> master_lecturer_id},master_lecturer_id", "unique:master_students,nim"];
            } else {
                $rules['nip'] = 'required|string|max:255';
            }

            $validated = $request -> validate($rules);

            $lecturer -> supervision_quota = $request -> input('supervision_quota');

            $masterLecturer -> full_name    = $validated['name'];
            $masterLecturer -> nip          = $validated['nip'];
            $masterLecturer -> email        = $validated['email'];

            if ($lecturer->isDirty()) {
                $lecturer->save();
            }

            if ($masterLecturer->isDirty()) {
                $masterLecturer->save();
            }
        }
        else if ($user -> role_name === 'mahasiswa'){
            $student = $user -> student;
            $masterStudent = $student -> masterStudent;

            $old_email = $masterStudent -> email;
            $new_email = $request -> input('email');

            if ($old_email != $new_email) {
                $rules['email'] = 'required|string|max:255|unique:master_students,email';
            } else {
                $rules['email'] = 'required|string|max:255';
            }

            $old_NIM = $masterStudent -> nim;
            $new_NIM = $request -> input('nim');

            if ($old_NIM != $new_NIM) {
                $rules['nim'] = ["required", "string", "regex:/^[0-9]+$/", "max:$MAX_NIM_LENGTH", "unique:master_lecturers,nip,{$masterStudent -> master_student_id},master_lecturer_id", "unique:master_students,nim"];
            } else {
                $rules['nim'] = 'required|string|max:255';
            }

            $validated = $request -> validate($rules);

            $masterStudent -> full_name    = $validated['name'];
            $masterStudent -> nim          = $validated['nim'];
            $masterStudent -> email        = $validated['email'];

            if ($masterStudent->isDirty()) {
                $masterStudent->save();
            }
        }

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
