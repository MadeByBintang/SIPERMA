<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return redirect()->route('login');
});


// Dashboard umum (mahasiswa/dosen)
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');


// Dashboard admin (tanpa middleware admin)
Route::get('/admin/dashboard', [DashboardController::class, 'adminIndex'])
    ->middleware(['auth', 'verified'])
    ->name('admin.dashboard');

// Hardcode menu lain untuk sementara
Route::get('/admin/users', function () {
    return 'Manage Users Page';
})->name('admin.users');

Route::get('/admin/projects', function () {
    return 'Projects Page';
})->name('admin.projects');

Route::get('/admin/approvals', function () {
    return 'Approvals Page';
})->name('admin.approvals');

Route::get('/admin/reports', function () {
    return 'Reports Page';
})->name('admin.reports');


// Profile tetap
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
