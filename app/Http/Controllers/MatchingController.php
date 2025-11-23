<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Student;
use App\Models\Lecturer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class MatchingController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        // Pastikan role terload
        // $user->load('role'); // Jika pakai relasi role
        $roleName = $user->role_name; // Atau pakai kolom role_name di users

        $matches = [];
        
        if ($roleName === 'student' && $user->student) {
            $matches = $this->generateMatchesForStudent($user->student);
        } elseif ($roleName === 'lecturer' && $user->lecturer) {
            $matches = $this->generateMatchesForLecturer($user->lecturer);
        }

        // Ambil nama user saat ini untuk display
        $currentName = $user->name;
        if ($roleName === 'student' && $user->student) $currentName = $user->student->name;
        if ($roleName === 'lecturer' && $user->lecturer) $currentName = $user->lecturer->name;

        return Inertia::render('MatchingPage', [
            'matches' => $matches,
            'currentUserName' => $currentName,
            'userRole' => strtolower($roleName), // 'student' atau 'lecturer'
        ]);
    }

    private function generateMatchesForStudent($student)
    {
        // Ambil Skill Mahasiswa
        $studentSkillIds = $student->skills->pluck('id')->toArray();
        $studentSkillNames = $student->skills->pluck('name')->toArray();
        $studentInterestString = !empty($studentSkillNames) ? implode(', ', $studentSkillNames) : ($student->interest_field ?? 'General');

        // Ambil semua Dosen beserta skill dan jumlah bimbingan aktif
        $lecturers = Lecturer::with(['user', 'skills', 'supervisions' => function($q) {
            $q->where('supervision_status', 'active');
        }])->get();

        return $lecturers->map(function ($lecturer) use ($student, $studentSkillIds, $studentSkillNames, $studentInterestString) {
            
            // 1. Hitung Kecocokan Skill
            $lecturerSkillIds = $lecturer->skills->pluck('id')->toArray();
            $lecturerSkillNames = $lecturer->skills->pluck('name')->toArray();
            
            $commonSkills = array_intersect($studentSkillIds, $lecturerSkillIds);
            $matchCount = count($commonSkills);
            $totalStudentSkills = count($studentSkillIds);

            // Skor Dasar
            $score = $totalStudentSkills > 0 
                ? round(($matchCount / $totalStudentSkills) * 100) 
                : 0;

            // Bonus Skor jika Keahlian Dosen mengandung Minat Mahasiswa (String matching sederhana)
            foreach ($studentSkillNames as $skill) {
                if (stripos(implode(' ', $lecturerSkillNames), $skill) !== false) {
                    $score += 10;
                }
            }

            // Batasi Skor maks 100
            $score = min($score, 100);
            
            // Fallback: Jika skor 0 (tidak ada skill sama), beri skor random kecil agar tidak kosong melompong
            if ($score == 0) $score = rand(30, 50); 

            // 2. Cek Ketersediaan
            $currentStudents = $lecturer->supervisions->count();
            $maxStudents = $lecturer->quota ?? 8;
            
            $availability = 'Available';
            if ($currentStudents >= $maxStudents) {
                $availability = 'Not Available';
            } elseif ($currentStudents >= $maxStudents - 2) {
                $availability = 'Limited';
            }

            // 3. Generate Alasan
            $reasons = [];
            if ($score >= 80) $reasons[] = "Strong alignment in interests";
            if (!empty($commonSkills)) {
                $sharedSkillNames = $lecturer->skills->whereIn('id', $commonSkills)->pluck('name')->toArray();
                if (!empty($sharedSkillNames)) {
                    $reasons[] = "Shared interest in " . implode(', ', array_slice($sharedSkillNames, 0, 2));
                }
            }
            
            // HAPUS LOGIC GPA DISINI

            return [
                'id' => $lecturer->lecturer_id,
                
                // Data Mahasiswa
                'studentName' => $student->name,
                'studentNIM' => $student->nim,
                'studentInterest' => $studentInterestString,
                'studentEmail' => $student->user->email ?? '-',
                'studentDescription' => 'Student',
                
                // Data Dosen
                'recommendedLecturer' => $lecturer->name,
                'lecturerNIP' => $lecturer->nip,
                'lecturerExpertise' => implode(', ', $lecturerSkillNames),
                'lecturerEmail' => $lecturer->user->email ?? '-',
                'lecturerDescription' => $lecturer->description ?? 'Expert in field',
                'lecturerCurrentStudents' => $currentStudents,
                'lecturerMaxStudents' => $maxStudents,
                
                // Skor & Status
                'matchScore' => $score,
                'availability' => $availability,
                'matchingReasons' => $reasons,
            ];
        })
        ->sortByDesc('matchScore') 
        ->values(); 
    }

    private function generateMatchesForLecturer($lecturer)
    {
        $lecturerSkillIds = $lecturer->skills->pluck('id')->toArray();
        $lecturerExpertiseString = $lecturer->skills->pluck('name')->implode(', ');

        $students = Student::with(['user', 'skills'])->get();

        return $students->map(function ($student) use ($lecturer, $lecturerSkillIds, $lecturerExpertiseString) {
            
            $studentSkillIds = $student->skills->pluck('id')->toArray();
            $studentSkillNames = $student->skills->pluck('name')->toArray();
            
            $commonSkills = array_intersect($lecturerSkillIds, $studentSkillIds);
            $matchCount = count($commonSkills);
            
            $totalLecturerSkills = count($lecturerSkillIds);
            $score = $totalLecturerSkills > 0 
                ? round(($matchCount / $totalLecturerSkills) * 100) 
                : 0;
            
            if (empty($studentSkillIds)) $score = rand(40, 60); 
            else $score = min($score, 100);

            $reasons = [];
            if ($score > 75) $reasons[] = "Student profile matches your expertise";
            
            // HAPUS LOGIC GPA DISINI (Logic GPA > 3.75 dihapus)
            
            if (!empty($commonSkills)) $reasons[] = "Skills match";
            if (empty($reasons)) $reasons[] = "Potential research assistant";

            return [
                'id' => $student->student_id,
                
                // Data Mahasiswa
                'studentName' => $student->name ?? $student->user->name,
                'studentNIM' => $student->nim,
                'studentInterest' => !empty($studentSkillNames) ? implode(', ', $studentSkillNames) : '-',
                'studentEmail' => $student->user->email ?? '-',
                'studentDescription' => 'Student',
                
                // Data Dosen
                'recommendedLecturer' => $lecturer->name,
                'lecturerNIP' => $lecturer->nip,
                'lecturerExpertise' => $lecturerExpertiseString,
                'lecturerEmail' => $lecturer->user->email ?? '-',
                'lecturerDescription' => $lecturer->description,
                'lecturerCurrentStudents' => 0, 
                'lecturerMaxStudents' => $lecturer->quota,
                
                'matchScore' => $score,
                'availability' => 'Available',
                'matchingReasons' => $reasons,
            ];
        })
        ->sortByDesc('matchScore')
        ->values();
    }
}