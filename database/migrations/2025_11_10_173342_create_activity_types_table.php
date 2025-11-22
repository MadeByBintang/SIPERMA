<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_types', function (Blueprint $table) {
           
            $table->bigIncrements('activity_type_id'); 
            
            $table->string('type_name'); 
            $table->text('description')->nullable();
            
            
        });

        DB::table('activity_types')->insert([
            ['type_name' => 'PKL', 'description' => 'Praktik Kerja Lapangan'],
            ['type_name' => 'Thesis', 'description' => 'Skripsi / Tugas Akhir'],
            ['type_name' => 'Competition', 'description' => 'Lomba Akademik/Non-Akademik'],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_types');
    }
};