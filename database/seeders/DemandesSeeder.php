<?php

namespace Database\Seeders;

use App\Models\Demande;
use App\Models\User;
use App\Models\TypeDemande;
use App\Enums\RoleEnum;
use App\Enums\StatutDemandeEnum;
use App\Enums\PrioriteEnum;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DemandesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $citoyens = User::where('role', RoleEnum::CITOYEN)->get();
        $agents = User::where('role', RoleEnum::AGENT)->get();
        $types = TypeDemande::all();

        for ($i = 1; $i <= 25; $i++) {
            $type = $types->random();
            $statut = fake()->randomElement(StatutDemandeEnum::cases());
            
            $demande = Demande::create([
                'uuid' => (string) Str::uuid(),
                'numero_dossier' => 'MAI-' . date('Y') . '-' . str_pad($i, 5, '0', STR_PAD_LEFT),
                'user_id' => $citoyens->random()->id,
                'agent_id' => $statut === StatutDemandeEnum::EN_ATTENTE ? null : $agents->random()->id,
                'type_demande_id' => $type->id,
                'statut' => $statut,
                'priorite' => fake()->randomElement(PrioriteEnum::cases()),
                'description' => "Demande de test numéro $i pour " . $type->libelle,
                'motif_rejet' => $statut === StatutDemandeEnum::REJETEE ? 'Document non conforme ou illisible.' : null,
                'date_echeance' => now()->addDays($type->delai_jours_ouvrables),
                'created_at' => now()->subDays(fake()->numberBetween(0, 30)),
            ]);
        }
    }
}
