<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id('activity_id');
            $table->unsignedBigInteger('activity_type_id');
            $table->unsignedBigInteger('internship_id')->nullable();
            $table->string('title', 150);
            $table->text('description')->nullable();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->timestamps();

            $table->foreign('activity_type_id')->references('activity_type_id')->on('activity_types');
             $table->foreign('internship_id')->references('internship_id')->on('internships');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
