<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('demande_naissances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('demande_id')->constrained()->onDelete('cascade');
            $table->string('nom');
            $table->string('prenoms');
            $table->date('date_naissance');
            $table->string('lieu_naissance');
            $table->enum('genre', ['F', 'M']);
            $table->string('nom_pere');
            $table->string('prenom_pere');
            $table->date('date_naissance_pere');
            $table->string('profession_pere');
            $table->string('nom_mere');
            $table->string('prenom_mere');
            $table->date('date_naissance_mere');
            $table->string('profession_mere');
            $table->integer('nombre_copies')->default(1);
            $table->string('motif');
            $table->text('observations')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('demande_naissances');
    }
};
