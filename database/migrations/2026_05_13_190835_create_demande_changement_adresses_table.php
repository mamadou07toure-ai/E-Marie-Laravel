<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('demande_changement_adresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('demande_id')->constrained()->onDelete('cascade');
            $table->string('nom');
            $table->string('prenoms');
            $table->date('date_naissance');
            $table->text('ancienne_adresse');
            $table->text('nouvelle_adresse');
            $table->string('quartier_commune_nouveau');
            $table->date('date_installation');
            $table->string('motif_changement');
            $table->text('observations')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('demande_changement_adresses');
    }
};
