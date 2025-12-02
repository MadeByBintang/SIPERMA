<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supervisions', function (Blueprint $table) {
            $table->id('supervision_id');
            $table->unsignedBigInteger('student_id')->nullable();
            $table->unsignedBigInteger('lecturer_id');
            $table->unsignedBigInteger('team_id')->nullable();
            $table->unsignedBigInteger('activity_id');
            $table->enum('supervision_status', ['pending', 'approved', 'rejected', 'completed']);

            $table->dateTime('assigned_at');
            $table->dateTime('responded_at')->nullable();
            $table->dateTime('finished_at')->nullable();

            $table->text('notes')->nullable();

            $table->foreign('student_id')->references('student_id')->on('students');
            $table->foreign('lecturer_id')->references('lecturer_id')->on('lecturers');
            $table->foreign('team_id')->references('team_id')->on('teams');
            $table->foreign('activity_id')->references('activity_id')->on('activities');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('supervisions');
    }
};
