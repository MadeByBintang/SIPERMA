<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_interests', function (Blueprint $table) {
            $table->id('interest_id');
            $table->unsignedBigInteger('student_id');
            $table->string('interest_name', 100);

            $table->foreign('student_id')->references('student_id')->on('students');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_interests');
    }
};
