<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('team_members', function (Blueprint $table) {
            $table->id('team_member_id');
            $table->unsignedBigInteger('team_id');
            $table->unsignedBigInteger('student_id');
            $table->string('role_in_team', 50);
            $table->string('member_status', 50)->default('pending');

            $table->foreign('team_id')->references('team_id')->on('teams');
            $table->foreign('student_id')->references('student_id')->on('students');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('team_members');
    }
};
