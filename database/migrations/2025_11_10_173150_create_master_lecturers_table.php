<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('master_lecturers', function (Blueprint $table) {
            $table->id('master_lecturer_id');
            $table->string('nip', 20)->unique();
            $table->string('full_name', 100);
            $table->string('email', 100)->unique();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('master_lecturers');
    }
};
