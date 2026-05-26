<?php

namespace Database\Seeders;

use App\Models\TypeDemande;
use Illuminate\Database\Seeder;

class TypesDemandesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            [
                'code' => 'ACTE_NAISSANCE',
                'libelle' => 'Acte de naissance',
                'description' => 'Demande d\'extrait d\'acte de naissance ou copie intégrale.',
                'delai_jours_ouvrables' => 3,
            ],
            [
                'code' => 'CERTIFICAT_RESIDENCE',
                'libelle' => 'Certificat de résidence',
                'description' => 'Attestation prouvant votre domicile dans la commune.',
                'delai_jours_ouvrables' => 2,
            ],
            [
                'code' => 'CERTIFICAT_MARIAGE',
                'libelle' => 'Certificat de mariage',
                'description' => 'Copie d\'acte de mariage célébré à la mairie.',
                'delai_jours_ouvrables' => 3,
            ],
            [
                'code' => 'LEGALISATION_DOCUMENT',
                'libelle' => 'Légalisation de document',
                'description' => 'Certification de la validité d\'une signature sur un acte.',
                'delai_jours_ouvrables' => 1,
            ],
            [
                'code' => 'AUTORISATION_ADMINISTRATIVE',
                'libelle' => 'Autorisation administrative',
                'description' => 'Demande d\'autorisation pour commerce, événement ou construction.',
                'delai_jours_ouvrables' => 10,
            ],
            [
                'code' => 'CHANGEMENT_ADRESSE',
                'libelle' => 'Changement d\'adresse',
                'description' => 'Déclaration de changement de domicile.',
                'delai_jours_ouvrables' => 5,
            ],
        ];

        foreach ($types as $type) {
            TypeDemande::create($type);
        }
    }
}
