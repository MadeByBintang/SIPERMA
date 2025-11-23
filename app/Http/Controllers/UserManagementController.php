<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\Student;
use App\Models\Lecturer;
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
        
        // Ambil Data Students
        $students = User::query()
            ->whereHas('role', fn($q) => $q->where('role_name', 'Student'))
            ->with('student')
            ->when($search, function($query, $search) {
                 $query->whereHas('student', fn($q) => 
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('nim', 'like', "%{$search}%")
                 );
            })
            ->latest()
            ->get()
            ->map(function ($user) {
                return [
                    'id' => (string) $user->user_id, 
                    'nim' => $user->student->nim ?? '-',
                    'name' => $user->student->name ?? $user->username,
                    'email' => $user->email,
                    //'phone' => $user->student->phone ?? '-',
                    'major' => $user->student->major ?? '-',
                    'year' => $user->student->year ?? '-',
                    //'gpa' => (float) ($user->student->gpa ?? 0.00),
                    
                    // PERBAIKAN 1: Ambil status dari tabel User (is_active), bukan student
                    'status' => $user->is_active ? 'active' : 'inactive',
                    
                    'enrollmentDate' => $user->student->enrollment_date 
                                      ? date('Y-m-d', strtotime($user->student->enrollment_date)) 
                                      : date('Y-m-d'),
                ];
            });

        // Ambil Data Dosen
        $lecturers = User::query()
            ->whereHas('role', fn($q) => $q->where('role_name', 'Lecturer'))
            ->with('lecturer')
            ->when($search, function($query, $search) {
                 $query->whereHas('lecturer', fn($q) => 
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('nip', 'like', "%{$search}%")
                 );
            })
            ->latest()
            ->get()
            ->map(function ($user) {
                return [
                    'id' => (string) $user->user_id,
                    'nip' => $user->lecturer->nip ?? '-',
                    'name' => $user->lecturer->name ?? $user->username,
                    'email' => $user->email,
                    //'phone' => $user->lecturer->phone ?? '-',
                    'department' => $user->lecturer->department ?? '-',
                    'expertise' => $user->lecturer->expertise 
                                   ? array_map('trim', explode(',', $user->lecturer->expertise)) 
                                   : [], 
                    
                    // PERBAIKAN 2: Ambil status dari tabel User (is_active), bukan lecturer
                    'status' => $user->is_active ? 'active' : 'inactive',
                    
                    'hireDate' => $user->lecturer->hire_date 
                                  ? date('Y-m-d', strtotime($user->lecturer->hire_date)) 
                                  : date('Y-m-d'),
                ];
            });

        return Inertia::render('UserManagementPage', [
            'students' => $students,
            'lecturers' => $lecturers,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users,email',
        ]);

        DB::transaction(function () use ($request) {
            $roleName = 'Student'; 
            if ($request->has('department') && $request->department) {
                $roleName = 'Lecturer';
            } else if ($request->has('userType')) {
                $roleName = $request->userType === 'student' ? 'Student' : 'Lecturer';
            }

            $role = Role::where('role_name', $roleName)->firstOrFail();

            // Create User (is_active default true dari database)
            $user = User::create([
                'username' => $roleName === 'Student' ? $request->nim : $request->nip,
                'email' => $request->email,
                'password' => Hash::make('password123'), 
                'role_id' => $role->role_id,
                'is_active' => true, // Opsional: Explicitly set active
            ]);

            // Create Profil
            if ($roleName === 'Student') {
                $user->student()->create([
                    'nim' => $request->nim,
                    'name' => $request->name,
                    //'phone' => $request->phone,
                    'major' => $request->major,
                    'year' => $request->year,
                    //'gpa' => $request->gpa,
                    // PERBAIKAN 3: HAPUS 'status' => 'active' (karena kolom tidak ada di DB student)
                    'enrollment_date' => now(),
                ]);
            } else {
                $expertiseVal = $request->expertise;
                if (is_array($expertiseVal)) {
                    $expertiseVal = implode(',', $expertiseVal);
                }

                $user->lecturer()->create([
                    'nip' => $request->nip,
                    'name' => $request->name,
                    //'phone' => $request->phone,
                    'department' => $request->department,
                    'expertise' => $expertiseVal,
                    // PERBAIKAN 4: HAPUS 'status' => 'active' (karena kolom tidak ada di DB lecturer)
                    'hire_date' => now(),
                ]);
            }
        });

        return redirect()->back()->with('success', 'User created successfully');
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        DB::transaction(function () use ($request, $user) {
            
            $user->update([
                'email' => $request->email
            ]);

            if ($user->role_name === 'student' && $user->student) { 
                $user->student()->update([
                    'name' => $request->name,  
                    //'phone' => $request->phone,
                    'major' => $request->major,
                    'year' => $request->year,
                    //'gpa' => $request->gpa,
                    'nim' => $request->nim,
                ]);
            } elseif (($user->role_name === 'lecturer' || $user->role_name === 'dosen') && $user->lecturer) {
                $expertiseVal = $request->expertise;
                if (is_array($expertiseVal)) {
                    $expertiseVal = implode(',', $expertiseVal);
                }

                $user->lecturer()->update([
                    'name' => $request->name, 
                    //'phone' => $request->phone, 
                    'department' => $request->department,
                    'expertise' => $expertiseVal,
                    'nip' => $request->nip,
                ]);
            }
        });

        return redirect()->back()->with('success', 'User updated successfully');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete(); 
        return redirect()->back()->with('success', 'User deleted successfully');
    }

    public function toggleStatus($id)
    {
        $user = User::findOrFail($id);

        // Opsional: Cegah admin menonaktifkan dirinya sendiri
        if ($user->id === auth::id()) {
            return redirect()->back()->with('error', 'Cannot deactivate your own account.');
        }

        // Logic Toggle (True jadi False, False jadi True)
        $user->is_active = !$user->is_active;
        $user->save();

        // Pesan dinamis untuk UI
        $statusMsg = $user->is_active ? 'activated' : 'deactivated';
        return redirect()->back()->with('success', "User successfully {$statusMsg}.");
    }
}