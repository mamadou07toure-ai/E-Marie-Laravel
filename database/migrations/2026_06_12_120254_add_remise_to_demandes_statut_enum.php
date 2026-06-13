<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE demandes MODIFY COLUMN statut ENUM('en_attente', 'en_cours', 'document_manquant', 'validee', 'rejetee', 'remise') DEFAULT 'en_attente'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE demandes MODIFY COLUMN statut ENUM('en_attente', 'en_cours', 'document_manquant', 'validee', 'rejetee') DEFAULT 'en_attente'");
    }
};
