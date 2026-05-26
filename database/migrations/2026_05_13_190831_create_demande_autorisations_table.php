<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('demande_autorisations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('demande_id')->constrained()->onDelete('cascade');
            $table->string('raison_sociale');
            $table->string('prenoms')->nullable();
            $table->string('nature_autorisation');
            $table->text('description_detaillee');
            $table->text('adresse_activite');
            $table->date('date_debut');
            $table->date('date_fin')->nullable();
            $table->integer('nombre_personnes')->nullable();
            $table->text('observations')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('demande_autorisations');
    }
};
