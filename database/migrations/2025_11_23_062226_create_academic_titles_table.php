<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up()
{
    Schema::create('academic_titles', function (Blueprint $table) {
        $table->id(); // Ini ID otomatis
        $table->string('name'); // Nama Gelar (Dr., S.Kom, dll)
        $table->enum('type', ['front', 'back']); // Type: Depan / Belakang
        $table->timestamps();
    });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_titles');
    }
};
