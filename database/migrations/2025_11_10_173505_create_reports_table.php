<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id('report_id');
            $table->string('report_type', 50);
            $table->string('report_period', 50);
            $table->unsignedBigInteger('generated_by');
            $table->string('status', 20);
            $table->text('description')->nullable();
            $table->timestamps();

            $table->foreign('generated_by')->references('user_id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
