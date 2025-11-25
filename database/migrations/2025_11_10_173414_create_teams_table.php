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

            // $table->unsignedBigInteger('activity_id');
            $table->text('description')->nullable();

            $table->string('status')->default('pending');

            $table->timestamps();
            $table->softDeletes();


            // $table->foreign('activity_id')
            //       ->references('activity_id')
            //       ->on('activities');


            // $table->unsignedBigInteger('leader_id')->nullable();
            // $table->unsignedBigInteger('supervision_id')->nullable();

            // $table->foreign('leader_id')->references('student_id')->on('students')->onDelete('set null');
            // $table->foreign('supervision_id')->references('supervision_id')->on('supervisions')->onDelete('set null');
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('teams');
    }
};
