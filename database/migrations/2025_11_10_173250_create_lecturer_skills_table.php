<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lecturer_skills', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('lecturer_id');
            $table->unsignedBigInteger('skill_id');
            $table->tinyInteger('level')->unsigned()->comment('1=Low, 5=Expert');
            $table->tinyInteger('priority')->unsigned()->default(3)->comment('1=Low interest, 5=Very interested');
            $table->timestamps();

            $table -> foreign('lecturer_id') -> references('lecturer_id') -> on('lecturers');
            $table -> foreign('skill_id') -> references('skill_id') -> on('skills');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lecturer_skills');
    }
};
