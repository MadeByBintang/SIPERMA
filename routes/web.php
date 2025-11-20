<?php

use App\Http\Controllers\StudentProfileController;
use App\Http\Controllers\LecturerProfileController;
use App\Http\Controllers\AdminProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use Illuminate\Http\Request;

Route::get('/', function () {
    return redirect()->route('login');
});

// Dashboard umum (mahasiswa/dosen)
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// Dashboard admin
Route::get('/admin/dashboard', [DashboardController::class, 'adminIndex'])
    ->middleware(['auth', 'verified'])
    ->name('admin.dashboard');

// HALAMAN PROFIL PER ROLE
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/profile/student', [StudentProfileController::class, 'index'])
        ->name('profile.student');

    Route::get('/profile/lecturer', [LecturerProfileController::class, 'index'])
        ->name('profile.lecturer');

    Route::get('/profile/admin', [AdminProfileController::class, 'index'])
        ->name('profile.admin');
});

// ROUTE PROFILE UTAMA — AUTO REDIRECT SESUAI ROLE
Route::get('/profile', function (Request $request) {
    $role = $request->user()->role_name;

    return match ($role) {
        'admin' => redirect()->route('profile.admin'),
        'lecturer' => redirect()->route('profile.lecturer'),
        default => redirect()->route('profile.student'),
    };
})->middleware(['auth', 'verified'])->name('profile');

// Halaman registrasi mahasiswa
Route::get('/registration', [App\Http\Controllers\RegistrationController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('registration');

// Halaman Application Status mahasiswa
Route::get('/application-status', [App\Http\Controllers\ApplicationStatusController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('application.status');

// Halaman Matching (mahasiswa/lecturer)
Route::get('/matching', [App\Http\Controllers\MatchingController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('matching');

// Halaman Timeline Progress (mahasiswa/dosen)
Route::get('/timeline', [App\Http\Controllers\TimelineProgressController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('timeline.progress');

// Halaman Relations Management (mahasiswa/dosen)
Route::get('/relations', [App\Http\Controllers\RelationManagementController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('relations');

// Halaman Reports (mahasiswa/dosen)
Route::get('/reports', [App\Http\Controllers\ReportsController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('reports');

// Halaman Approval Center (dosen)
Route::get('/approval', [App\Http\Controllers\ApprovalCenterController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('approval');

// Halaman User Management (admin)
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/users', [\App\Http\Controllers\UserManagementController::class, 'index'])
        ->name('users');
});

// Halaman Project Overview (Admin)
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/projects', [\App\Http\Controllers\ProjectOverviewController::class, 'index'])
        ->name('projects');
});

// Halaman Relations Management (Admin)
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/relations', [\App\Http\Controllers\AdminRelationsController::class, 'index'])
        ->name('relations');
});

// Halaman System Reports (Admin)
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/reports', [\App\Http\Controllers\SystemReportsController::class, 'index'])
        ->name('reports');
});

// Halaman System Setting (Admin)
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/settings', [\App\Http\Controllers\SystemSettingsController::class, 'index'])
        ->name('settings');
});

require __DIR__ . '/auth.php';
