<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('demande_mariages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('demande_id')->constrained()->onDelete('cascade');
            // Époux
            $table->string('nom_epoux');
            $table->string('prenom_epoux');
            $table->date('date_naissance_epoux');
            $table->string('lieu_naissance_epoux');
            // Épouse
            $table->string('nom_epouse');
            $table->string('prenom_epouse');
            $table->date('date_naissance_epouse');
            $table->string('lieu_naissance_epouse');
            // Union
            $table->date('date_mariage');
            $table->string('lieu_mariage');
            $table->string('numero_acte_mariage')->nullable();
            
            $table->string('motif');
            $table->integer('nombre_copies')->default(1);
            $table->text('observations')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('demande_mariages');
    }
};
