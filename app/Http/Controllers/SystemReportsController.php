<?php

namespace App\Http\Controllers;

use App\Models\Supervision;
use App\Models\Team;
use App\Models\Lecturer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class SystemReportsController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        
      
        $dateRange = $request->input('date', 'year');
        $startDate = $this->getStartDate($dateRange);

        
        $supervisionsQuery = Supervision::with(['student.user', 'lecturer.user', 'activity']);
        
        if ($startDate) {
            
            $supervisionsQuery->where('assigned_date', '>=', $startDate);
        }
        $supervisions = $supervisionsQuery->get();

       
        $teamsQuery = Team::with(['leader.student', 'supervisor']);
        
        if ($startDate) {
            
        }
        $teams = $teamsQuery->get();

        
        
        
        $totalProjects = $supervisions->count() + $teams->count();

        
        $activeSupervisions = $supervisions->filter(fn($s) => in_array(strtolower($s->supervision_status), ['active', 'ongoing', 'approved']))->count();
        $activeTeams = $teams->filter(fn($t) => in_array(strtolower($t->status), ['active', 'ongoing']))->count();
        $totalActive = $activeSupervisions + $activeTeams;

      
        $completedSupervisions = $supervisions->filter(fn($s) => strtolower($s->supervision_status) === 'completed')->count();
        $completedTeams = $teams->filter(fn($t) => strtolower($t->status) === 'completed')->count();
        $totalCompleted = $completedSupervisions + $completedTeams;

       
        $totalSupervisors = Lecturer::count();
        
      
        $avgStudents = $totalSupervisors > 0 ? round($totalProjects / $totalSupervisors, 1) : 0;

        
        $engagementRate = $totalProjects > 0 ? round(($totalActive / $totalProjects) * 100) : 0;

        
        $pklCount = $supervisions->where('activity.activity_type', 'PKL')->count() + $teams->where('type', 'PKL')->count();
        $thesisCount = $supervisions->where('activity.activity_type', 'Thesis')->count(); // Tim biasanya tidak ada tesis
        $competitionCount = $teams->where('type', 'Competition')->count();

        return Inertia::render('SystemReportsPage', [
            'filters' => $request->all(),
            'stats' => [
                'totalProjects' => $totalProjects,
                'activeProjects' => $totalActive,
                'completedProjects' => $totalCompleted,
                'totalSupervisors' => $totalSupervisors,
                'avgStudentsPerSupervisor' => $avgStudents,
                'engagementRate' => $engagementRate,
                'departments' => 4, 
                
                
                'distribution' => [
                    'pkl' => $pklCount,
                    'thesis' => $thesisCount,
                    'competition' => $competitionCount
                ]
            ]
        ]);
    }

    private function getStartDate($range)
    {
        return match($range) {
            'month' => Carbon::now()->startOfMonth(),
            'quarter' => Carbon::now()->subMonths(3),
            'year' => Carbon::now()->startOfYear(),
            default => null // all time
        };
    }
}