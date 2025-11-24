<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    if (!Schema::hasTable('internships')) {
        Schema::create('internships', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('address')->nullable();

            // Kolom tambahan yang tadi kita buat
            $table->string('sector', 50);
            $table->string('owner_name', 100);
            $table->string('owner_email', 100)->nullable();
            $table->string('owner_phone', 20)->nullable();

            $table->timestamps();
        });
    }
}

public function down()
{
    Schema::dropIfExists('internships');
}
};
