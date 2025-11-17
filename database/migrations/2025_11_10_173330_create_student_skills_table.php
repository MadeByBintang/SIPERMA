<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_skills', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('skill_id');
            $table->tinyInteger('level')->unsigned()->comment('1=Low, 5=Expert');
            $table->timestamps();

            $table -> foreign('student_id') -> references('student_id') -> on('students');
            $table -> foreign('skill_id') -> references('skill_id') -> on('skills');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_skills');
    }
};
