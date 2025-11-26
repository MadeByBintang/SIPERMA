<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id('log_id');
            $table->unsignedBigInteger('activity_id');
            $table->dateTime('log_date');
            $table->text('progress_note');
            // $table->string('action_type', 50);

            $table->foreign('activity_id')->references('activity_id')->on('activities');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
