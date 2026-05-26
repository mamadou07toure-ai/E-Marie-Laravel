<?php

namespace App\Http\Requests\Demande;

use App\Enums\PrioriteEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreDemandeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'type_demande_id' => ['required', 'string'],
            'priorite' => ['required', new Enum(PrioriteEnum::class)],
            'description' => ['nullable', 'string', 'max:1000'],
            'fields' => ['required', 'array'],
            'documents' => ['nullable', 'array'],
            'documents.*' => ['file', 'max:10240', 'mimes:pdf,jpg,jpeg,png'],
        ];

        $type = $this->input('type_demande_id');

        if ($type === 'ACTE_NAISSANCE') {
            $rules = array_merge($rules, [
                'fields.nom' => ['required', 'string', 'max:255'],
                'fields.prenoms' => ['required', 'string', 'max:255'],
                'fields.date_naissance' => ['required', 'date'],
                'fields.lieu_naissance' => ['required', 'string', 'max:255'],
                'fields.genre' => ['required', 'in:F,M'],
                'fields.nom_pere' => ['required', 'string', 'max:255'],
                'fields.prenom_pere' => ['required', 'string', 'max:255'],
                'fields.date_naissance_pere' => ['required', 'date'],
                'fields.profession_pere' => ['required', 'string', 'max:255'],
                'fields.nom_mere' => ['required', 'string', 'max:255'],
                'fields.prenom_mere' => ['required', 'string', 'max:255'],
                'fields.date_naissance_mere' => ['required', 'date'],
                'fields.profession_mere' => ['required', 'string', 'max:255'],
                'fields.motif' => ['required', 'string', 'max:255'],
                'fields.nombre_copies' => ['required', 'integer', 'min:1'],
                'fields.observations' => ['nullable', 'string', 'max:1000'],
            ]);
        } elseif ($type === 'CERTIFICAT_RESIDENCE') {
            $rules = array_merge($rules, [
                'fields.nom' => ['required', 'string', 'max:255'],
                'fields.prenoms' => ['required', 'string', 'max:255'],
                'fields.date_naissance' => ['required', 'date'],
                'fields.lieu_naissance' => ['required', 'string', 'max:255'],
                'fields.adresse_complete' => ['required', 'string', 'max:500'],
                'fields.profession' => ['nullable', 'string', 'max:255'],
                'fields.quartier_commune' => ['required', 'string', 'max:255'],
                'fields.duree_residence' => ['required', 'string', 'max:255'],
                'fields.motif' => ['required', 'string', 'max:255'],
                'fields.nombre_copies' => ['required', 'integer', 'min:1'],
                'fields.observations' => ['nullable', 'string', 'max:1000'],
            ]);
        } elseif ($type === 'CERTIFICAT_MARIAGE') {
            $rules = array_merge($rules, [
                'fields.nom_epoux' => ['required', 'string', 'max:255'],
                'fields.prenom_epoux' => ['required', 'string', 'max:255'],
                'fields.date_naissance_epoux' => ['required', 'date'],
                'fields.lieu_naissance_epoux' => ['required', 'string', 'max:255'],
                'fields.nom_epouse' => ['required', 'string', 'max:255'],
                'fields.prenom_epouse' => ['required', 'string', 'max:255'],
                'fields.date_naissance_epouse' => ['required', 'date'],
                'fields.lieu_naissance_epouse' => ['required', 'string', 'max:255'],
                'fields.date_mariage' => ['required', 'date'],
                'fields.lieu_mariage' => ['required', 'string', 'max:255'],
                'fields.numero_acte_mariage' => ['nullable', 'string', 'max:255'],
                'fields.motif' => ['required', 'string', 'max:255'],
                'fields.nombre_copies' => ['required', 'integer', 'min:1'],
                'fields.observations' => ['nullable', 'string', 'max:1000'],
            ]);
        } elseif ($type === 'LEGALISATION_DOCUMENT') {
            $rules = array_merge($rules, [
                'fields.nom' => ['required', 'string', 'max:255'],
                'fields.prenoms' => ['required', 'string', 'max:255'],
                'fields.type_document' => ['required', 'string', 'max:255'],
                'fields.description_document' => ['required', 'string', 'max:1000'],
                'fields.langue_document' => ['required', 'string', 'max:255'],
                'fields.pays_destination' => ['required', 'string', 'max:255'],
                'fields.usage_prevu' => ['required', 'string', 'max:1000'],
                'fields.nombre_copies' => ['required', 'integer', 'min:1'],
                'fields.observations' => ['nullable', 'string', 'max:1000'],
            ]);
        } elseif ($type === 'AUTORISATION_ADMINISTRATIVE') {
            $rules = array_merge($rules, [
                'fields.raison_sociale' => ['required', 'string', 'max:255'],
                'fields.prenoms' => ['nullable', 'string', 'max:255'],
                'fields.nature_autorisation' => ['required', 'string', 'max:255'],
                'fields.description_detaillee' => ['required', 'string', 'max:2000'],
                'fields.adresse_activite' => ['required', 'string', 'max:1000'],
                'fields.date_debut' => ['required', 'date'],
                'fields.date_fin' => ['nullable', 'date', 'after_or_equal:fields.date_debut'],
                'fields.nombre_personnes' => ['nullable', 'integer', 'min:1'],
                'fields.observations' => ['nullable', 'string', 'max:1000'],
            ]);
        } elseif ($type === 'CHANGEMENT_ADRESSE') {
            $rules = array_merge($rules, [
                'fields.nom' => ['required', 'string', 'max:255'],
                'fields.prenoms' => ['required', 'string', 'max:255'],
                'fields.date_naissance' => ['required', 'date'],
                'fields.ancienne_adresse' => ['required', 'string', 'max:1000'],
                'fields.nouvelle_adresse' => ['required', 'string', 'max:1000'],
                'fields.quartier_commune_nouveau' => ['required', 'string', 'max:255'],
                'fields.date_installation' => ['required', 'date'],
                'fields.motif_changement' => ['required', 'string', 'max:500'],
                'fields.observations' => ['nullable', 'string', 'max:1000'],
            ]);
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'type_demande_id.required' => 'Veuillez sélectionner un type de demande.',
            'priorite.required'        => 'La priorité est obligatoire.',
            'priorite.Enum'            => 'La valeur de priorité sélectionnée est invalide.',
            'fields.required'          => 'Les informations du formulaire sont manquantes.',
            'fields.array'             => 'Les données du formulaire sont incorrectes.',

            'fields.nom.required'             => 'Le nom est obligatoire.',
            'fields.prenoms.required'         => 'Les prénoms sont obligatoires.',
            'fields.date_naissance.required'  => 'La date de naissance est obligatoire.',
            'fields.date_naissance.date'      => 'La date de naissance est invalide.',
            'fields.lieu_naissance.required'  => 'Le lieu de naissance est obligatoire.',
            'fields.genre.required'           => 'Le genre est obligatoire.',
            'fields.genre.in'                 => 'Le genre doit être F ou M.',
            'fields.nom_pere.required'        => 'Le nom du père est obligatoire.',
            'fields.prenom_pere.required'     => 'Le prénom du père est obligatoire.',
            'fields.date_naissance_pere.required' => 'La date de naissance du père est obligatoire.',
            'fields.date_naissance_pere.date'     => 'La date de naissance du père est invalide.',
            'fields.profession_pere.required' => 'La profession du père est obligatoire.',
            'fields.nom_mere.required'        => 'Le nom de la mère est obligatoire.',
            'fields.prenom_mere.required'     => 'Le prénom de la mère est obligatoire.',
            'fields.date_naissance_mere.required' => 'La date de naissance de la mère est obligatoire.',
            'fields.date_naissance_mere.date'     => 'La date de naissance de la mère est invalide.',
            'fields.profession_mere.required' => 'La profession de la mère est obligatoire.',
            'fields.motif.required'           => 'Le motif est obligatoire.',
            'fields.nombre_copies.required'   => 'Le nombre de copies est obligatoire.',
            'fields.nombre_copies.integer'    => 'Le nombre de copies doit être un entier.',
            'fields.nombre_copies.min'        => 'Le nombre de copies doit être au moins 1.',

            'fields.adresse_complete.required'  => "L'adresse complète est obligatoire.",
            'fields.quartier_commune.required'  => 'Le quartier / commune est obligatoire.',
            'fields.duree_residence.required'   => 'La durée de résidence est obligatoire.',

            'fields.nom_epoux.required'            => "Le nom de l'époux est obligatoire.",
            'fields.prenom_epoux.required'         => "Le prénom de l'époux est obligatoire.",
            'fields.date_naissance_epoux.required' => "La date de naissance de l'époux est obligatoire.",
            'fields.date_naissance_epoux.date'     => "La date de naissance de l'époux est invalide.",
            'fields.lieu_naissance_epoux.required' => "Le lieu de naissance de l'époux est obligatoire.",
            'fields.nom_epouse.required'           => "Le nom de l'épouse est obligatoire.",
            'fields.prenom_epouse.required'        => "Le prénom de l'épouse est obligatoire.",
            'fields.date_naissance_epouse.required' => "La date de naissance de l'épouse est obligatoire.",
            'fields.date_naissance_epouse.date'    => "La date de naissance de l'épouse est invalide.",
            'fields.lieu_naissance_epouse.required' => "Le lieu de naissance de l'épouse est obligatoire.",
            'fields.date_mariage.required'         => 'La date du mariage est obligatoire.',
            'fields.date_mariage.date'             => 'La date du mariage est invalide.',
            'fields.lieu_mariage.required'         => 'Le lieu du mariage est obligatoire.',

            'fields.type_document.required'        => 'Le type de document est obligatoire.',
            'fields.description_document.required' => 'La description du document est obligatoire.',
            'fields.langue_document.required'      => 'La langue du document est obligatoire.',
            'fields.pays_destination.required'     => 'Le pays de destination est obligatoire.',
            'fields.usage_prevu.required'          => "L'usage prévu est obligatoire.",
            
            'fields.raison_sociale.required'       => "La raison sociale ou nom de l'organisation est obligatoire.",
            'fields.nature_autorisation.required'  => "La nature de l'autorisation est obligatoire.",
            'fields.description_detaillee.required'=> "La description détaillée est obligatoire.",
            'fields.adresse_activite.required'     => "L'adresse de l'activité est obligatoire.",
            'fields.date_debut.required'           => "La date de début est obligatoire.",
            'fields.date_debut.date'               => "La date de début est invalide.",
            'fields.date_fin.date'                 => "La date de fin est invalide.",
            'fields.date_fin.after_or_equal'       => "La date de fin doit être égale ou postérieure à la date de début.",
            
            'fields.ancienne_adresse.required'     => "L'ancienne adresse est obligatoire.",
            'fields.nouvelle_adresse.required'     => "La nouvelle adresse est obligatoire.",
            'fields.quartier_commune_nouveau.required'=> "Le nouveau quartier ou commune est obligatoire.",
            'fields.date_installation.required'    => "La date d'installation est obligatoire.",
            'fields.date_installation.date'        => "La date d'installation est invalide.",
            'fields.motif_changement.required'     => "Le motif du changement d'adresse est obligatoire.",

            'documents.array'    => 'Les fichiers joints sont invalides.',
            'documents.*.file'   => 'Chaque pièce jointe doit être un fichier valide.',
            'documents.*.max'    => 'Chaque fichier ne doit pas dépasser 10 Mo.',
            'documents.*.mimes'  => 'Formats acceptés : PDF, JPG, JPEG, PNG uniquement.',
        ];
    }
}
