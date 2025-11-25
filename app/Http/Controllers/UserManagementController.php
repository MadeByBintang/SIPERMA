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
    /**
     * Menampilkan daftar semua pengguna.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');

        // 1. Ambil Master Students
        $masterStudentsQuery = MasterStudent::query();
        if ($search) {
            $masterStudentsQuery->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('nim', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        $masterStudents = $masterStudentsQuery->orderBy('full_name')->get();

        // 2. Ambil Master Lecturers
        $masterLecturersQuery = MasterLecturer::query();
        if ($search) {
            $masterLecturersQuery->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('nip', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        $masterLecturers = $masterLecturersQuery->orderBy('full_name')->get();

        // 3. Prepare usernames
        $studentUsernames = $masterStudents->pluck('nim')->filter()->unique()->values()->all();
        $lecturerUsernames = $masterLecturers->pluck('nip')->filter()->unique()->values()->all();
        $allUsernames = array_merge($studentUsernames, $lecturerUsernames);

        // Load relasi 'lecturer' agar bisa mengambil supervision_quota
        $usersByUsername = User::with('lecturer')
            ->whereIn('username', $allUsernames)
            ->get()
            ->keyBy('username');

        // 4. Map Data Students
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

        // 5. Map Data Lecturers
        $lecturers = $masterLecturers->map(function ($m) use ($usersByUsername) {
            $user = $usersByUsername->get(trim($m->nip));
            $isRegistered = $user !== null;

            // Ambil quota dari tabel lecturers (profil)
            $quota = 0;
            if ($isRegistered && $user->lecturer) {
                $quota = $user->lecturer->supervision_quota;
            }

            $expertise = [];
            if (!empty($m->expertise)) {
                $expertise = array_map('trim', explode(',', $m->expertise));
            }

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

    /**
     * Menyimpan pengguna baru.
     */
    public function store(Request $request)
    {
        $isStudent = $request->userType === 'student' || (!$request->has('department') && $request->userType !== 'lecturer');
        
        $table = $isStudent ? 'master_students' : 'master_lecturers';
        
        $rules = [
            'email' => "required|email|unique:{$table},email",
            'supervision_quota' => !$isStudent ? 'required|integer|min:0|max:20' : 'nullable',
        ];

        if ($isStudent) {
            // PERBAIKAN: Cek unique di master_students DAN di users
            $rules['nim'] = "required|string|unique:master_students,nim|unique:users,username"; 
        } else {
            // PERBAIKAN: Cek unique di master_lecturers DAN di users
            $rules['nip'] = "required|string|unique:master_lecturers,nip|unique:users,username";
        }

        $messages = [
            'email.unique' => 'This email is already registered.',
            'nim.unique' => 'This NIM is already registered or used as a username.',
            'nip.unique' => 'This NIP is already registered or used as a username.',
            'users.unique' => 'This ID is already in use by another account.',
        ];

        $request->validate($rules, $messages);

        $username = trim($isStudent ? $request->nim : $request->nip);
        
        // Double check user trash (optional safety)
        $existingUser = User::withTrashed()->where('username', $username)->first();
        if ($existingUser && !$existingUser->trashed()) {
            return redirect()->back()->withErrors([
                ($isStudent ? 'nim' : 'nip') => 'User account is already active.'
            ]);
        }

        DB::transaction(function () use ($request, $isStudent, $username, $existingUser) {
            $roleName = $isStudent ? 'mahasiswa' : 'dosen';
            $role = Role::where('role_name', $roleName)->firstOrFail();
            
            // A. Simpan ke Master Data
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

            // B. Buat User Login
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

            // C. Hubungkan Profil & Simpan Quota
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

    /**
     * Memperbarui data pengguna.
     */
    public function update(Request $request, $id)
    {
        // 1. Handle jika ID adalah string (Edit Master Only)
        if (!is_numeric($id)) {
            $parts = explode('-', $id);
            $prefix = $parts[0];
            $masterId = $parts[1];
            $tableMaster = ($prefix === 'mstu') ? 'master_students' : 'master_lecturers';
            $pkColumn = ($prefix === 'mstu') ? 'master_student_id' : 'master_lecturer_id';

            $rules = ['email' => "required|email|unique:{$tableMaster},email,{$masterId},{$pkColumn}"];
            
            if ($prefix === 'mstu') {
                // Cek Unique Master Students
                $rules['nim'] = "required|string|unique:master_students,nim,{$masterId},master_student_id";
                $request->validate($rules);
                MasterStudent::where('master_student_id', $masterId)->update([
                    'full_name' => $request->name, 'email' => $request->email, 'nim' => trim($request->nim)
                ]);
            } else {
                // Cek Unique Master Lecturers
                $rules['nip'] = "required|string|unique:master_lecturers,nip,{$masterId},master_lecturer_id";
                $request->validate($rules);
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
        
        $tableMaster = $isStudent ? 'master_students' : 'master_lecturers';
        $pkColumn = $isStudent ? 'master_student_id' : 'master_lecturer_id';
        
        $ignoreId = 0;
        if ($isStudent && $user->student) $ignoreId = $user->student->master_student_id ?? 0;
        elseif (!$isStudent && $user->lecturer) $ignoreId = $user->lecturer->master_lecturer_id ?? 0;

        $rules = [
            'email' => "required|email|unique:{$tableMaster},email,{$ignoreId},{$pkColumn}"
        ];

        if (!$isStudent) {
            // VALIDASI DOSEN
            $rules['nip'] = [
                'required',
                'string',
                // Cek unique di master_lecturers (ignore self)
                "unique:master_lecturers,nip,{$ignoreId},master_lecturer_id",
                // PERBAIKAN: Cek unique di users juga (ignore self)
                "unique:users,username,{$user->user_id},user_id"
            ];
            $rules['supervision_quota'] = 'required|integer|min:0|max:20';
        } else {
            // VALIDASI MAHASISWA
            $rules['nim'] = [
                'required',
                'string',
                // Cek unique di master_students (ignore self)
                "unique:master_students,nim,{$ignoreId},master_student_id",
                // PERBAIKAN: Cek unique di users juga (ignore self)
                "unique:users,username,{$user->user_id},user_id"
            ];
        }

        // Pesan Error Kustom agar user paham kenapa gagal
        $messages = [
            'email.unique' => 'Email is already taken.',
            'nim.unique' => 'NIM or Username is already taken by another account.',
            'nip.unique' => 'NIP or Username is already taken by another account.',
        ];

        $request->validate($rules, $messages);

        DB::transaction(function () use ($request, $user, $isStudent) {
            if ($isStudent && $user->student && $user->student->masterStudent) {
                // Update Student
                $user->student->masterStudent->update([
                    'full_name' => $request->name,
                    'email' => $request->email,
                    'nim' => trim($request->nim),
                ]);
                if ($request->nim !== $user->username) $user->update(['username' => trim($request->nim)]);

            } elseif (!$isStudent && $user->lecturer && $user->lecturer->masterLecturer) {
                // Update Lecturer
                // 1. Update Master Info
                $user->lecturer->masterLecturer->update([
                    'full_name' => $request->name,
                    'email' => $request->email,
                    'nip' => trim($request->nip),
                ]);

                // 2. Update Quota di tabel Lecturers
                $user->lecturer->update([
                    'supervision_quota' => $request->supervision_quota
                ]);

                if ($request->nip !== $user->username) $user->update(['username' => trim($request->nip)]);
            }
        });

        return redirect()->route('admin.users')->with('success', 'User updated successfully');
    }

    /**
     * Hapus Data.
     */
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
                
                if ($user->user_id === Auth::user()->user_id) {
                    throw new \Exception('Cannot delete your own account.');
                }

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

    /**
     * Toggle Status.
     */
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
            return redirect()->back()->with('success', "Status successfully updated.");
        }

        return redirect()->back()->with('error', 'Failed to toggle status: Record not found.');
    }
}