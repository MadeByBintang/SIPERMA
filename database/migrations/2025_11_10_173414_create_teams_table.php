<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teams', function (Blueprint $table) {
            $table->bigIncrements('team_id');

            $table->string('team_name', 100);
            $table->unsignedBigInteger('activity_id');
            $table->unsignedBigInteger('leader_id');
            $table->unsignedBigInteger('supervisor_id')->nullable();

            $table->text('description')->nullable();

            $table->string('status')->default('pending');

            $table->timestamps();
            $table->softDeletes();


            $table->foreign('activity_id')->references('activity_id')->on('activities');
            $table->foreign('leader_id')->references('user_id')->on('users');
            $table->foreign('supervisor_id')->references('lecturer_id')->on('lecturers')->onDelete('set null');
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('teams');
    }
};
