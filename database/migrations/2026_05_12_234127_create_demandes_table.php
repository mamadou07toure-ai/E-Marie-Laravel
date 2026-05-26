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
        Schema::create('demandes', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('numero_dossier', 20)->unique();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('agent_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('type_demande_id')->constrained('types_demandes');
            $table->enum('statut', ['en_attente', 'en_cours', 'document_manquant', 'validee', 'rejetee'])->default('en_attente');
            $table->enum('priorite', ['normale', 'haute', 'urgente'])->default('normale');
            $table->text('description')->nullable();
            $table->text('motif_rejet')->nullable();
            $table->text('notes_internes')->nullable();
            $table->date('date_echeance')->nullable();
            $table->timestamp('date_cloture')->nullable();
            $table->timestamps();

            // Index obligatoires
            $table->index('user_id');
            $table->index('agent_id');
            $table->index(['statut', 'created_at']);
            // numero_dossier est déjà indexé par unique()
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('demandes');
    }
};
