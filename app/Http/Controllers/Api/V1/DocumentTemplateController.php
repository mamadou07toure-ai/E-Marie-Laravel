<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\DocumentTemplate;
use App\Models\TypeDemande;
use App\Services\DocumentGeneratorService;
use App\Models\Demande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentTemplateController extends Controller
{
    /** Liste tous les types de demandes avec leur template éventuel */
    public function index()
    {
        $types = TypeDemande::with('documentTemplate')->where('is_active', true)->orderBy('libelle')->get();

        return response()->json($types->map(fn($t) => [
            'id'       => $t->id,
            'code'     => $t->code,
            'libelle'  => $t->libelle,
            'template' => $t->documentTemplate,
        ]));
    }

    /** Upload de l'image + création/mise à jour du template */
    public function store(Request $request)
    {
        $request->validate([
            'type_demande_id' => 'required|exists:types_demandes,id',
            'nom'             => 'required|string|max:255',
            'image'           => 'required|file|mimes:jpg,jpeg,png|max:10240',
        ]);

        // Supprime l'ancienne image si un template existait
        $existing = DocumentTemplate::where('type_demande_id', $request->type_demande_id)->first();
        if ($existing && $existing->chemin_image) {
            Storage::disk('public')->delete($existing->chemin_image);
        }

        $path = $request->file('image')->store('templates', 'public');

        $template = DocumentTemplate::updateOrCreate(
            ['type_demande_id' => $request->type_demande_id],
            ['nom' => $request->nom, 'chemin_image' => $path, 'actif' => false]
        );

        return response()->json($template, 201);
    }

    /** Mise à jour des champs positionnés */
    public function updateChamps(Request $request, $id)
    {
        $request->validate([
            'champs'   => 'required|array',
            'champs.*.key'       => 'required|string',
            'champs.*.label'     => 'required|string',
            'champs.*.x'         => 'required|numeric|min:0|max:100',
            'champs.*.y'         => 'required|numeric|min:0|max:100',
            'champs.*.font_size' => 'required|integer|min:6|max:72',
            'champs.*.bold'      => 'boolean',
            'champs.*.color'     => 'required|string',
        ]);

        $template = DocumentTemplate::findOrFail($id);
        $template->update(['champs' => $request->champs]);

        return response()->json($template);
    }

    /** Active ou désactive un template */
    public function toggle($id)
    {
        $template = DocumentTemplate::findOrFail($id);
        $template->update(['actif' => !$template->actif]);

        return response()->json(['actif' => $template->actif]);
    }

    /** Supprime un template */
    public function destroy($id)
    {
        $template = DocumentTemplate::findOrFail($id);
        if ($template->chemin_image) {
            Storage::disk('public')->delete($template->chemin_image);
        }
        $template->delete();

        return response()->json(['ok' => true]);
    }

    /** Génère et télécharge le PDF d'un dossier validé */
    public function generer($uuid)
    {
        $demande = Demande::with([
            'user', 'typeDemande', 'agent',
            'naissance', 'residence', 'mariage', 'legalisation',
        ])->where('uuid', $uuid)->firstOrFail();

        $statutValue = is_object($demande->statut) ? $demande->statut->value : $demande->statut;
        if ($statutValue !== 'validee') {
            return response()->json(['message' => 'Le dossier doit être validé pour générer le document.'], 422);
        }

        $service = new DocumentGeneratorService();
        $pdf     = $service->generer($demande);

        $filename = 'Document_' . $demande->numero_dossier . '.pdf';

        return response($pdf, 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }
}
