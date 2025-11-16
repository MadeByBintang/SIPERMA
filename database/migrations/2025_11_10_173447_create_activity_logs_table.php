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
            $table->unsignedBigInteger('supervision_id');
            $table->unsignedBigInteger('user_id');
            $table->dateTime('log_date');
            $table->text('progress_note');
            $table->string('action_type', 50);

            $table->foreign('supervision_id')->references('supervision_id')->on('supervisions');
            $table->foreign('user_id')->references('user_id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
