<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Modifikasi tabel 'users' agar sesuai ERD
        Schema::create('users', function (Blueprint $table) {
            $table->id('user_id'); // Sesuai ERD
            $table->unsignedBigInteger('role_id'); // Sesuai ERD
            $table->string('username', 100)->unique(); // Sesuai ERD
            $table->string('email', 100)->unique(); // Sesuai ERD
            $table->string('password', 255); // Sesuai ERD
            $table->timestamps(); // created_at, updated_at (Sesuai ERD)
            $table->softDeletes(); // deleted_at (Sesuai ERD)

            // Foreign key ke tabel 'roles'
            $table->foreign('role_id')->references('role_id')->on('roles');
        });

        // Tabel ini boleh dibiarkan (untuk fitur lupa password)
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // Tabel ini boleh dibiarkan (untuk manajemen session)
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
