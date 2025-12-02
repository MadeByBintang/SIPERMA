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
            $table->text('description')->nullable();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('teams');
    }
};
