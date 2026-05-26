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
        Schema::table('users', function (Blueprint $table) {
            $table->uuid('uuid')->unique()->after('id');
            $table->string('nom', 100)->after('uuid');
            $table->string('prenom', 100)->after('nom');
            $table->string('telephone', 20)->nullable()->after('email');
            $table->enum('role', ['citoyen', 'agent', 'administrateur'])->default('citoyen')->after('password');
            $table->boolean('is_active')->default(true)->after('role');
            $table->timestamp('last_login_at')->nullable()->after('is_active');
            
            // On peut supprimer 'name' si on veut être strict, 
            // mais attention si Laravel ou des packages en dépendent.
            // Pour ce projet, on va le supprimer comme demandé implicitement par la structure.
            $table->dropColumn('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('name')->after('id');
            $table->dropColumn(['uuid', 'nom', 'prenom', 'telephone', 'role', 'is_active', 'last_login_at']);
        });
    }
};
