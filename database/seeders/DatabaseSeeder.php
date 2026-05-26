<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\TypeDemande;
use App\Models\Demande;
use App\Enums\RoleEnum;
use App\Enums\StatutDemandeEnum;
use App\Enums\PrioriteEnum;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Créer les Types de Demandes
        $types = [
            ['code' => 'ACTE_NAISSANCE', 'libelle' => 'Extrait d\'Acte de Naissance', 'delai_jours_ouvrables' => 3, 'tarif' => 5000],
            ['code' => 'CERTIFICAT_RESIDENCE', 'libelle' => 'Certificat de Résidence', 'delai_jours_ouvrables' => 2, 'tarif' => 2000],
            ['code' => 'ACTE_MARIAGE', 'libelle' => 'Extrait d\'Acte de Mariage', 'delai_jours_ouvrables' => 5, 'tarif' => 10000],
            ['code' => 'LEGALISATION', 'libelle' => 'Légalisation de document', 'delai_jours_ouvrables' => 1, 'tarif' => 1000],
            ['code' => 'CERTIFICAT_DECES', 'libelle' => 'Certificat de Décès', 'delai_jours_ouvrables' => 2, 'tarif' => 0],
        ];

        foreach ($types as $type) {
            TypeDemande::updateOrCreate(['code' => $type['code']], $type);
        }

        // 2. Créer l'Administrateur
        User::updateOrCreate(
            ['email' => 'admin@mairie.gn'],
            [
                'uuid' => Str::uuid(),
                'nom' => 'ADMIN',
                'prenom' => 'Super',
                'telephone' => '620000001',
                'password' => Hash::make('password'),
                'role' => RoleEnum::ADMINISTRATEUR,
                'is_active' => true,
            ]
        );

        // 3. Créer des Agents
        $agents = [
            ['nom' => 'DIALLO', 'prenom' => 'Mamadou', 'email' => 'agent1@mairie.gn'],
            ['nom' => 'SYLLA', 'prenom' => 'Aissatou', 'email' => 'agent2@mairie.gn'],
        ];

        foreach ($agents as $a) {
            User::updateOrCreate(
                ['email' => $a['email']],
                [
                    'uuid' => Str::uuid(),
                    'nom' => $a['nom'],
                    'prenom' => $a['prenom'],
                    'telephone' => '620' . rand(1000000, 9999999),
                    'password' => Hash::make('password'),
                    'role' => RoleEnum::AGENT,
                    'is_active' => true,
                ]
            );
        }

        // 4. Créer des Citoyens
        $citoyens = [
            ['nom' => 'TOURE', 'prenom' => 'Ibrahima', 'email' => 'citoyen1@gmail.com'],
            ['nom' => 'BARRY', 'prenom' => 'Mariama', 'email' => 'citoyen2@gmail.com'],
            ['nom' => 'KEITA', 'prenom' => 'Sekou', 'email' => 'citoyen3@gmail.com'],
        ];

        foreach ($citoyens as $c) {
            $user = User::updateOrCreate(
                ['email' => $c['email']],
                [
                    'uuid' => Str::uuid(),
                    'nom' => $c['nom'],
                    'prenom' => $c['prenom'],
                    'telephone' => '664' . rand(1000000, 9999999),
                    'password' => Hash::make('password'),
                    'role' => RoleEnum::CITOYEN,
                    'is_active' => true,
                ]
            );

            // Créer quelques demandes pour chaque citoyen
            Demande::create([
                'user_id' => $user->id,
                'type_demande_id' => TypeDemande::inRandomOrder()->first()->id,
                'statut' => StatutDemandeEnum::EN_ATTENTE,
                'priorite' => PrioriteEnum::NORMALE,
                'description' => 'Demande de test pour ' . $c['prenom'],
            ]);
        }
    }
}
