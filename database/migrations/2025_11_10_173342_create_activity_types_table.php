<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_types', function (Blueprint $table) {
            $table->id('activity_type_id');
            $table->string('activity_type_name', 100);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_types');
    }
};
