<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id('student_id');
            $table->unsignedBigInteger('master_student_id')->unique();
            $table->unsignedBigInteger('user_id')->unique();
            // $table->string('interest_field', 255)->nullable();

            $table->foreign('master_student_id')->references('master_student_id')->on('master_students');
            $table->foreign('user_id')->references('user_id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
