<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lecturers', function (Blueprint $table) {
            $table->id('lecturer_id');
            $table->unsignedBigInteger('master_lecturer_id')->unique();
            $table->unsignedBigInteger('user_id')->unique();
            $table->enum('focus', ['BIG DATA', 'MTI', 'JARINGAN'])->nullable();
            $table->integer('supervision_quota')->default(0);

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('master_lecturer_id')->references('master_lecturer_id')->on('master_lecturers');
            $table->foreign('user_id')->references('user_id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lecturers');
    }
};
