<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('master_students', function (Blueprint $table) {
            $table->id('master_student_id');
            $table->string('nim', 20)->unique();
            $table->string('full_name', 100);
            $table->string('email', 100)->unique();
            $table->boolean('is_active')->default(true);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('master_students');
    }
};
