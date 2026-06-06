<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('document_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('type_demande_id')->unique()->constrained('types_demandes')->cascadeOnDelete();
            $table->string('nom');
            $table->string('chemin_image');
            $table->json('champs')->nullable(); // [{key, label, x, y, font_size, bold, color}]
            $table->boolean('actif')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_templates');
    }
};
