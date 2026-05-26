<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\StatutDemandeEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Demande\StoreDemandeRequest;
use App\Models\Demande;
use App\Models\TypeDemande;
use Illuminate\Http\Request;

class DemandeController extends Controller
{
    public function index(Request $request)
    {
        $demandes = Demande::where('user_id', $request->user()->id)
            ->with('typeDemande')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($demandes);
    }

    public function store(StoreDemandeRequest $request)
    {
        // Résoudre le type par code (le frontend envoie le code string, ex: 'ACTE_NAISSANCE')
        $typeDemande = TypeDemande::where('code', $request->type_demande_id)->firstOrFail();

        $demande = Demande::create([
            'user_id'         => $request->user()->id,
            'type_demande_id' => $typeDemande->id,
            'priorite'        => $request->priorite,
            'description'     => $request->description,
            'statut'          => StatutDemandeEnum::EN_ATTENTE,
        ]);

        // Créer les données spécifiques selon le code du type
        $fields = $request->fields ?? [];

        switch ($typeDemande->code) {
            case 'ACTE_NAISSANCE':
                $demande->naissance()->create($fields);
                break;
            case 'CERTIFICAT_RESIDENCE':
                $demande->residence()->create($fields);
                break;
            case 'CERTIFICAT_MARIAGE':
                $demande->mariage()->create($fields);
                break;
            case 'LEGALISATION_DOCUMENT':
                $demande->legalisation()->create($fields);
                break;
            case 'AUTORISATION_ADMINISTRATIVE':
                $demande->autorisation()->create($fields);
                break;
            case 'CHANGEMENT_ADRESSE':
                $demande->changementAdresse()->create($fields);
                break;
        }

        // Gérer l'upload des documents
        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $file) {
                $path = $file->store('documents/' . $demande->numero_dossier, 'local');
                
                $demande->documents()->create([
                    'uploaded_by' => $request->user()->id,
                    'nom_original' => $file->getClientOriginalName(),
                    'chemin_stockage' => $path,
                    'type_mime' => $file->getMimeType(),
                    'taille_octets' => $file->getSize(),
                    'type_document' => \App\Enums\TypeDocumentEnum::PIECE_JUSTIFICATIVE,
                    'is_validated' => false,
                    'created_at' => now(),
                ]);
            }
        }

        \Illuminate\Support\Facades\DB::table('audit_logs')->insert([
            'user_id'    => $request->user()->id,
            'action'     => 'Soumission Demande',
            'entite'     => 'demandes',
            'entite_id'  => $demande->id,
            'details'    => json_encode(['numero_dossier' => $demande->numero_dossier, 'type' => $typeDemande->code]),
            'ip_address' => $request->ip(),
            'created_at' => now(),
        ]);

        return response()->json([
            'message' => 'Votre demande officielle a été enregistrée avec succès.',
            'numero_dossier' => $demande->numero_dossier,
        ], 201);
    }

    public function show(Request $request, $uuid)
    {
        $demande = Demande::where('uuid', $uuid)
            ->where('user_id', $request->user()->id)
            ->with(['typeDemande', 'historiqueStatuts.user', 'documents', 'agent'])
            ->firstOrFail();

        return response()->json($demande);
    }

    public function stats(Request $request)
    {
        $stats = Demande::where('user_id', $request->user()->id)
            ->selectRaw('statut, count(*) as count')
            ->groupBy('statut')
            ->get();

        return response()->json($stats);
    }

    public function types()
    {
        return response()->json(TypeDemande::where('is_active', true)->get());
    }

    public function addDocument(Request $request, $uuid)
    {
        $request->validate([
            'document' => ['required', 'file', 'max:10240', 'mimes:pdf,jpg,jpeg,png'],
        ]);

        $demande = Demande::where('uuid', $uuid)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $file = $request->file('document');
        $path = $file->store('documents/' . $demande->numero_dossier, 'local');

        $document = $demande->documents()->create([
            'uploaded_by' => $request->user()->id,
            'nom_original' => $file->getClientOriginalName(),
            'chemin_stockage' => $path,
            'type_mime' => $file->getMimeType(),
            'taille_octets' => $file->getSize(),
            'type_document' => \App\Enums\TypeDocumentEnum::PIECE_JUSTIFICATIVE,
            'is_validated' => false,
            'created_at' => now(),
        ]);

        $ancienStatut = is_object($demande->statut) ? $demande->statut->value : $demande->statut;

        if ($ancienStatut === 'document_manquant') {
            $demande->update([
                'statut' => 'en_cours',
                'piece_manquante' => null
            ]);

            \App\Models\HistoriqueStatut::create([
                'demande_id'    => $demande->id,
                'user_id'       => $request->user()->id,
                'ancien_statut' => $ancienStatut,
                'nouveau_statut'=> 'en_cours',
                'commentaire'   => 'Soumission de la pièce justificative manquante par le citoyen : ' . $file->getClientOriginalName(),
            ]);

            if ($demande->agent_id) {
                \App\Models\Notification::create([
                    'user_id'    => $demande->agent_id,
                    'demande_id' => $demande->id,
                    'type'       => 'dossier',
                    'message'    => "Le citoyen a téléversé la pièce justificative manquante pour le dossier {$demande->numero_dossier} ({$file->getClientOriginalName()}).",
                    'lu'         => false,
                    'created_at' => now(),
                ]);
            }

            \Illuminate\Support\Facades\DB::table('audit_logs')->insert([
                'user_id'    => $request->user()->id,
                'action'     => 'Pièce Manquante Soumise',
                'entite'     => 'demandes',
                'entite_id'  => $demande->id,
                'details'    => json_encode(['numero_dossier' => $demande->numero_dossier, 'fichier' => $file->getClientOriginalName()]),
                'ip_address' => $request->ip(),
                'created_at' => now(),
            ]);
        }

        return response()->json([
            'message' => 'Document ajouté avec succès.',
            'document' => $document
        ]);
    }

    /**
     * Public document verification endpoint.
     */
    public function verifyPublic($uuid)
    {
        $demande = Demande::where('uuid', $uuid)
            ->with(['user', 'typeDemande', 'agent'])
            ->firstOrFail();

        return view('public.verify', compact('demande'));
    }
}
