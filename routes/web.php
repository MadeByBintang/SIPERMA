<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

// Import Semua Controller (Wajib agar tidak error Class Not Found)
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StudentProfileController;
use App\Http\Controllers\LecturerProfileController;
use App\Http\Controllers\AdminProfileController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\ApplicationStatusController;
use App\Http\Controllers\MatchingController;
use App\Http\Controllers\TimelineProgressController;
use App\Http\Controllers\RelationManagementController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\AcademicTitleController;
use App\Http\Controllers\ApprovalCenterController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\ProjectOverviewController;
use App\Http\Controllers\AdminRelationsController;
use App\Http\Controllers\SystemReportsController;
use App\Http\Controllers\SystemSettingsController;

// --- HALAMAN PUBLIC ---
Route::get('/', function () {
    return redirect()->route('login');
});

// --- DASHBOARD ---
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::get('/admin/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified', 'role:admin'])
    ->name('admin.dashboard');

// --- ROUTE PROFIL (Semua Role) ---
// Route::middleware(['auth', 'verified'])->group(function () {
//     // 1. Mahasiswa
//     Route::get('/profile/student', [StudentProfileController::class, 'index'])
//         ->name('profile.student');

//     // 2. Dosen
//     Route::get('/profile/lecturer', [LecturerProfileController::class, 'index'])
//         ->name('profile.lecturer');

//     Route::put('/profile/lecturer/update', [LecturerProfileController::class, 'update'])
//         ->name('profile.lecturer.update');

//     // 3. Admin
//     Route::get('/profile/admin', [AdminProfileController::class, 'index'])
//         ->name('profile.admin');

//     Route::post('/profile/admin/update', [AdminProfileController::class, 'update'])
//         ->name('profile.update');

//     Route::put('/password/update', [AdminProfileController::class, 'updatePassword'])
//         ->name('password.update');
// });

Route::middleware(['auth', 'verified', 'role:mahasiswa'])->group(function () {

    Route::get('/profile/student', [StudentProfileController::class, 'index'])
        ->name('profile.student');

    Route::post('/profile/student/update', [StudentProfileController::class, 'update'])
        ->name('profile.student.update');

});

Route::middleware(['auth', 'verified', 'role:dosen'])->group(function () {

    Route::get('/profile/lecturer', [LecturerProfileController::class, 'index'])
        ->name('profile.lecturer');

    Route::post('/profile/lecturer/update', [LecturerProfileController::class, 'update'])
        ->name('profile.lecturer.update');

});

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {

    Route::get('/profile/admin', [AdminProfileController::class, 'index'])
        ->name('profile.admin');

    Route::post('/profile/admin/update', [AdminProfileController::class, 'update'])
        ->name('profile.admin.update');

    Route::put('/profile/admin/accountupdate', [AdminProfileController::class, 'updateAccount'])
        ->name('profile.admin.accountupdate');

});


// --- REDIRECT PROFIL ---
Route::get('/profile', function (Request $request) {
    $role = $request->user()->role_name;
    return match ($role) {
        'admin' => redirect()->route('profile.admin'),
        'lecturer' => redirect()->route('profile.lecturer'),
        'default' => redirect()->route('profile.student'),
        default => redirect()->route('profile.student'),
    };
})->middleware(['auth', 'verified'])->name('profile');

// --- FITUR KHUSUS MAHASISWA ---
Route::middleware(['auth', 'verified'])->group(function () {
    // Registrasi (PKL/Skripsi/Lomba)
    Route::get('/registration', [RegistrationController::class, 'index'])
        ->name('registration');
    Route::post('/registration', [RegistrationController::class, 'store'])
        ->name('registration.store');

    // Status Aplikasi & Undangan
    Route::get('/application-status', [ApplicationStatusController::class, 'index'])
        ->name('application.status');
    Route::post('/application/respond/{id}', [ApplicationStatusController::class, 'respond'])
        ->name('application.respond');

    // Fitur Lain
    Route::get('/matching', [MatchingController::class, 'index'])
        ->name('matching');
    Route::get('/timeline', [TimelineProgressController::class, 'index'])
        ->name('timeline.progress');
});

// --- FITUR UMUM / DOSEN ---
Route::middleware(['auth', 'verified'])->group(function () {
    // Dosen bisa melihat ini, Mahasiswa juga mungkin (tergantung logic controller)
    Route::get('/relations', [RelationManagementController::class, 'index'])
        ->name('relations'); // Ini view untuk user biasa, beda dengan admin.relations

    Route::get('/reports', [ReportsController::class, 'index'])
        ->name('reports');

    Route::get('/approval', [ApprovalCenterController::class, 'index'])
        ->name('approval');
});

// --- FITUR KHUSUS ADMIN ---
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {

    // 1. User Management (LENGKAP dengan CRUD)
    Route::controller(UserManagementController::class)->group(function () {
        Route::get('/users', 'index')->name('users');
        Route::post('/users', 'store')->name('users.store');       // Create
        Route::put('/users/{id}', 'update')->name('users.update'); // Update
        Route::delete('/users/{id}', 'destroy')->name('users.destroy'); // Delete
        // Route khusus toggle status (opsional, pakai update biasa juga bisa)
        Route::put('/users/{id}/toggle-status', 'toggleStatus')->name('users.toggle-status');
    });

    // 2. Project Overview (Support Update)
    Route::controller(ProjectOverviewController::class)->group(function () {
        Route::get('/projects', 'index')->name('projects');
        Route::put('/projects/{id}', 'update')->name('projects.update');
    });

    // 3. Admin Relations (CRUD)
    Route::controller(AdminRelationsController::class)->group(function () {
        Route::get('/relations', 'index')->name('relations');
        Route::post('/relations', 'store')->name('relations.store');
        Route::put('/relations/{id}', 'update')->name('relations.update');
        Route::delete('/relations/{id}', 'destroy')->name('relations.destroy');
    });

    // 4. System Reports
    Route::get('/reports', [SystemReportsController::class, 'index'])
        ->name('reports');

    Route::post('/timeline/update-log', [\App\Http\Controllers\TimelineProgressController::class, 'updateLog'])
    ->middleware(['auth', 'verified'])
    ->name('timeline.progress.update');

    Route::resource('academic-titles', AcademicTitleController::class)->except(['create', 'show', 'edit']);

    // 5. System Settings
    Route::get('/settings', [SystemSettingsController::class, 'index'])
        ->name('settings');
});

require __DIR__ . '/auth.php';
