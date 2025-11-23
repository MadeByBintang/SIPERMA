<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\Supervision;
use App\Models\Team;
use App\Models\TeamMember;
use App\Models\Activity;
use Carbon\Carbon;

class AdminRelationsController extends Controller
{
    public function index(Request $request)
    {
        // 1. AMBIL SEMUA DATA THESIS/PKL (Student-Lecturer)
        $slRelations = Supervision::with(['student.user', 'lecturer.user', 'activity'])
            ->orderBy('supervision_id', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => 'sup_' . $item->supervision_id,
                    'real_id' => $item->supervision_id,
                    
                    'studentId' => $item->student_id,
                    'studentName' => $item->student->user->name ?? $item->student->name ?? 'Unknown',
                    'studentNim' => $item->student->nim ?? '-', 
                    
                    'lecturerId' => $item->lecturer_id,
                    'lecturerName' => $item->lecturer->user->name ?? $item->lecturer->name ?? 'Unknown',
                    'lecturerNip' => $item->lecturer->nip ?? '-',
                    
                    'activityType' => ucfirst($item->activity->activity_type ?? 'Thesis'), 
                    'activityTitle' => $item->activity->title ?? $item->notes ?? 'No Title',
                    
                    'status' => $this->mapStatus($item->supervision_status),
                    'startDate' => $item->assigned_date ? Carbon::parse($item->assigned_date)->format('Y-m-d') : null,
                ];
            });

        // 2. AMBIL SEMUA DATA TIM (Student-Student)
        $ssRelations = Team::with(['members.student.user', 'leader.student.user', 'supervisor.user'])
            ->latest()
            ->get()
            ->map(function ($team) {
                $leader = $team->leader->student ?? null;
                $member2 = $team->members->where('student_id', '!=', $team->leader_id)->first()->student ?? null;

                return [
                    'id' => 'team_' . $team->team_id,
                    'real_id' => $team->team_id,
                    
                    'student1Id' => $leader->student_id ?? null,
                    'student1Name' => $leader->user->name ?? $leader->name ?? 'Leader',
                    'student1Nim' => $leader->nim ?? '-',
                    
                    'student2Id' => $member2->student_id ?? null,
                    'student2Name' => $member2->user->name ?? $member2->name ?? 'Member',
                    'student2Nim' => $member2->nim ?? '-',
                    
                    'activityType' => ucfirst($team->type ?? 'Competition'),
                    'activityTitle' => $team->name,
                    'status' => $this->mapStatus($team->status),
                    'startDate' => $team->created_at ? $team->created_at->format('Y-m-d') : now()->format('Y-m-d'),
                ];
            });

        // [PENTING] AMBIL LIST USER UNTUK DROPDOWN DI FRONTEND
        $studentsList = \App\Models\Student::with('user')->get()->map(fn($s) => [
            'id' => $s->student_id, 
            'name' => $s->user->name ?? $s->name, 
            'nim' => $s->nim
        ]);
        
        $lecturersList = \App\Models\Lecturer::with('user')->get()->map(fn($l) => [
            'id' => $l->lecturer_id, 
            'name' => $l->user->name ?? $l->name
        ]);

        return Inertia::render('AdminRelationsPage', [
            'slRelations' => $slRelations,
            'ssRelations' => $ssRelations,
            'studentsList' => $studentsList, // Kirim ke Frontend
            'lecturersList' => $lecturersList, // Kirim ke Frontend
        ]);
    }
    
    // --- CREATE NEW RELATION (ADMIN FORCE CREATE) ---
    public function store(Request $request)
    {
        $request->validate([
            'relationType' => 'required|in:individual,team', 
            'student_id' => 'required|exists:students,student_id',
            'lecturer_id' => 'required|exists:lecturers,lecturer_id',
            'title' => 'required|string|max:255',
            'activity_type' => 'required|string', 
        ]);

        DB::transaction(function () use ($request) {
            
            // 1. Buat Activity
            $activity = Activity::create([
                'activity_type_id' => $this->getTypeId($request->activity_type),
                'title' => $request->title,
                'description' => 'Created by Admin',
                'start_date' => now(),
            ]);

            if ($request->relationType === 'individual') {
                // Buat Supervisi
                Supervision::create([
                    'student_id' => $request->student_id,
                    'lecturer_id' => $request->lecturer_id,
                    'activity_id' => $activity->activity_id,
                    'supervision_status' => 'active', 
                    'assigned_date' => now(),
                    'notes' => 'Manually assigned by Admin',
                ]);

            } else {
                // Buat Tim
                $team = Team::create([
                    'name' => $request->title,
                    'type' => $request->activity_type,
                    'leader_id' => \App\Models\Student::find($request->student_id)->user_id, 
                    'supervisor_id' => $request->lecturer_id,
                    'activity_id' => $activity->activity_id,
                    'status' => 'active',
                    'description' => 'Created by Admin',
                ]);

                TeamMember::create([
                    'team_id' => $team->team_id,
                    'student_id' => $request->student_id,
                    'role_in_team' => 'Leader',
                    'member_status' => 'active',
                ]);
            }
        });

        return redirect()->back()->with('success', 'Relation created successfully');
    }

    // --- UPDATE EXISTING RELATION ---
    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,active,completed,rejected',
            'activityTitle' => 'nullable|string|max:255',
        ]);

        DB::transaction(function () use ($request, $id) {
            if (str_starts_with($id, 'sup_')) {
                $realId = str_replace('sup_', '', $id);
                $supervision = Supervision::findOrFail($realId);

                $supervision->update([
                    'supervision_status' => $request->status,
                ]);
                
                if ($request->activityTitle && $supervision->activity) {
                    $supervision->activity->update(['title' => $request->activityTitle]);
                }

            } elseif (str_starts_with($id, 'team_')) {
                $realId = str_replace('team_', '', $id);
                $team = Team::findOrFail($realId);

                $team->update([
                    'status' => $request->status,
                ]);
                
                if ($request->activityTitle) {
                    $team->update(['name' => $request->activityTitle]);
                    if ($team->activity) {
                        $team->activity->update(['title' => $request->activityTitle]);
                    }
                }
            }
        });

        return redirect()->back()->with('success', 'Relation updated successfully');
    }

    // --- DELETE RELATION ---
    public function destroy($id)
    {
        DB::transaction(function () use ($id) {
            if (str_starts_with($id, 'sup_')) {
                $realId = str_replace('sup_', '', $id);
                $supervision = Supervision::findOrFail($realId);
                
                if ($supervision->activity) {
                    $supervision->activity->delete();
                }
                
                $supervision->delete();

            } elseif (str_starts_with($id, 'team_')) {
                $realId = str_replace('team_', '', $id);
                $team = Team::findOrFail($realId);
                
                $team->members()->delete();
                
                if ($team->activity) {
                    $team->activity->delete();
                }

                $team->delete();
            }
        });

        return redirect()->back()->with('success', 'Relation deleted successfully');
    }

    // --- HELPERS ---
    private function mapStatus($status) {
        $s = strtolower($status ?? '');
        if (in_array($s, ['active', 'approved', 'ongoing'])) return 'active';
        if (in_array($s, ['pending', 'proposal'])) return 'pending';
        if (in_array($s, ['completed', 'finished'])) return 'completed';
        if (in_array($s, ['rejected', 'terminated', 'cancelled'])) return 'rejected';
        return 'active';
    }

    private function getTypeId($typeString) {
        $s = strtolower($typeString);
        if (str_contains($s, 'thesis') || str_contains($s, 'skripsi')) return 1;
        if (str_contains($s, 'pkl') || str_contains($s, 'internship')) return 2;
        if (str_contains($s, 'competition') || str_contains($s, 'lomba')) return 3;
        return 1;
    }
}