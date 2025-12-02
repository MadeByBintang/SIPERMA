<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckUserActive
{
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $user = Auth::user();
            $isActive = false;

            if ($user->role_name === 'mahasiswa') {
                $isActive = $user->student?->masterStudent?->is_active ?? false;
            } elseif ($user->role_name === 'dosen') {
                $isActive = $user->lecturer?->masterLecturer?->is_active ?? false;
            } elseif ($user->role_name === 'admin') {
                $isActive = true;
            }

            if (!$isActive) {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return redirect()->route('login')->withErrors([
                    'username' => 'Your account has been deactivated. Please contact administrator.',
                ]);
            }
        }

        return $next($request);
    }
}
