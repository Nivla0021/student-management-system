<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('student_id')->unique();
            $table->string('course'); // e.g. BSIT
            $table->string('year_level'); // e.g. 1st Year
            $table->string('section')->nullable(); // e.g. IT-401
            $table->enum('enrollment_status', ['active', 'dropped', 'graduated'])->default('active');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('students');
    }
};

