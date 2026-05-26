<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('demande_legalisations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('demande_id')->constrained()->onDelete('cascade');
            $table->string('nom');
            $table->string('prenoms');
            $table->string('type_document');
            $table->text('description_document');
            $table->string('langue_document');
            $table->string('pays_destination');
            $table->text('usage_prevu');
            $table->integer('nombre_copies')->default(1);
            $table->text('observations')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('demande_legalisations');
    }
};
