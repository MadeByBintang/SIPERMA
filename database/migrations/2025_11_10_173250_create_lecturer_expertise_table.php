<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lecturer_expertise', function (Blueprint $table) {
            $table->id('expertise_id');
            $table->unsignedBigInteger('lecturer_id');
            $table->string('expertise_name', 100);

            $table->foreign('lecturer_id')->references('lecturer_id')->on('lecturers');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lecturer_expertise');
    }
};
