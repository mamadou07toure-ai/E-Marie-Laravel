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
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('demande_id')->constrained('demandes')->onDelete('cascade');
            $table->foreignId('uploaded_by')->constrained('users');
            $table->string('nom_original', 255);
            $table->string('chemin_stockage', 500);
            $table->string('type_mime', 100);
            $table->unsignedBigInteger('taille_octets');
            $table->enum('type_document', ['piece_justificative', 'document_genere']);
            $table->boolean('is_validated')->nullable(); // NULL=en attente, 1=validé, 0=refusé
            $table->timestamp('created_at')->nullable();

            $table->index('demande_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
