<?php

namespace App\Http\Controllers;

use App\Models\Supervision;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ProjectOverviewController extends Controller
{
    public function index()
    {
        // 1. AMBIL DATA THESIS & PKL (Tabel Supervisions)
        $supervisions = Supervision::with(['student', 'lecturer', 'activity'])
            // PERBAIKAN: Ganti latest() dengan orderBy('supervision_id', 'desc')
            // karena tabel supervisions tidak punya kolom created_at
            ->orderBy('supervision_id', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => 'sup_' . $item->supervision_id, // Gunakan supervision_id
                    'real_id' => $item->supervision_id,     // Gunakan supervision_id
                    'source' => 'supervision',
                    
                    // Gunakan null coalescing (??) untuk mencegah error jika relasi kosong
                    'type' => strtolower($item->activity->activity_type ?? 'thesis'), 
                    'title' => $item->activity->title ?? 'Untitled Project', // Ambil title dari relasi activity
                    
                    'teamMembers' => [$item->student->name ?? 'Unknown'], 
                    
                    'supervisor' => $item->lecturer->name ?? '-',
                    'status' => $this->mapStatus($item->supervision_status), // Sesuaikan nama kolom status
                    'progress' => 0, // Jika tidak ada kolom progress, set default 0
                    
                    'startDate' => $item->assigned_date ? Carbon::parse($item->assigned_date)->format('Y-m-d') : null,
                    'endDate' => null, // Tabel tidak punya end_date
                    
                    'description' => $item->notes ?? '-', // Gunakan notes sebagai description
                    'department' => $item->student->department ?? 'General',
                ];
            });

        // 2. AMBIL DATA LOMBA (Tabel Teams)
        // Pastikan model Team juga dicek apakah punya created_at atau tidak.
        // Jika Team punya created_at, latest() aman. Jika tidak, ganti juga.
        $teams = Team::with(['leader.student', 'members.student', 'supervisor.user'])
            ->latest() 
            ->get()
            ->map(function ($team) {
                // ... (kode mapping team tetap sama)
                $members = collect([$team->leader->student->name ?? 'Leader']);
                foreach ($team->members as $member) {
                    if ($member->student) {
                        $members->push($member->student->name);
                    }
                }

                return [
                    'id' => 'team_' . $team->id,
                    'real_id' => $team->id,
                    'source' => 'team',
                    'type' => 'competition',
                    'title' => $team->name ?? 'Untitled Team',
                    'teamMembers' => $members->toArray(),
                    'supervisor' => $team->supervisor->name ?? '-',
                    'status' => $this->mapStatus($team->status),
                    'progress' => (int) ($team->progress ?? 0),
                    'startDate' => $team->created_at ? $team->created_at->format('Y-m-d') : null,
                    'endDate' => $team->competition_date ?? null,
                    'description' => $team->description ?? "Competition: {$team->competition_name}",
                    'department' => $team->leader->student->department ?? 'General',
                ];
            });

        $projects = $supervisions->concat($teams)->values();

        return Inertia::render('ProjectOverviewPage', [
            'projects' => $projects
        ]);
    }

    public function update(Request $request, $id)
    {
        // ... (Validasi tetap sama) ...
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'progress' => 'required|integer|min:0|max:100',
            'status' => 'required|string',
            'startDate' => 'nullable|date',
            'endDate' => 'nullable|date',
        ]);

        if (str_starts_with($id, 'sup_')) {
            $realId = str_replace('sup_', '', $id);
            $model = Supervision::findOrFail($realId);
            
            // Update Supervision (sesuaikan nama kolom DB Anda)
            $model->update([
                'supervision_status' => $data['status'], // Sesuaikan nama kolom
                'assigned_date' => $data['startDate'],   // Sesuaikan nama kolom
                'notes' => $data['description'],         // Sesuaikan nama kolom
            ]);
            
            // Update Activity Relasi (Title ada di tabel activities)
            if($model->activity) {
                 $model->activity->update([
                    'title' => $data['title'],
                    // 'status' => $data['status'] // Jika activity punya status sendiri
                 ]);
            }

        } elseif (str_starts_with($id, 'team_')) {
            // ... (Update Team tetap sama) ...
            $realId = str_replace('team_', '', $id);
            $model = Team::findOrFail($realId);
            $model->update([
                'name' => $data['title'], 
                'description' => $data['description'],
                'progress' => $data['progress'],
                'status' => $data['status'],
            ]);
        }

        return redirect()->back()->with('success', 'Project updated successfully');
    }

    public function destroy($id)
    {

        DB::transaction(function () use ($id) {
            if (str_starts_with($id, 'sup_')) {
                $realId = str_replace('sup_', '', $id);
                $supervision = Supervision::findOrFail($realId);
                
                // Hapus Activity-nya juga agar bersih
                if ($supervision->activity) {
                    $supervision->activity->delete();
                }
                
                $supervision->delete();

            } elseif (str_starts_with($id, 'team_')) {
                $realId = str_replace('team_', '', $id);
                $team = Team::findOrFail($realId);
                
                // Hapus Members dulu
                $team->members()->delete();
                
                if ($team->activity) {
                    $team->activity->delete();
                }

                $team->delete();
            }
        });

        return redirect()->back()->with('success', 'Project deleted successfully');
    }

    private function mapStatus($status)
    {
        // ... (Helper mapStatus tetap sama) ...
        $s = strtolower($status ?? '');
        if (in_array($s, ['approved', 'active', 'ongoing'])) return 'ongoing';
        if (in_array($s, ['completed', 'finished'])) return 'completed';
        if (in_array($s, ['rejected', 'cancelled', 'terminated'])) return 'cancelled';
        return 'pending';
    }
}