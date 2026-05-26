<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    public function download(Request $request, $id)
    {
        $document = Document::findOrFail($id);
        $user     = $request->user();

        // Vérification d'accès : propriétaire du dossier, agent assigné, ou admin
        $demande = $document->demande()->with('agent')->first();

        $isOwner     = $demande->user_id    === $user->id;
        $isAgent     = $demande->agent_id   === $user->id;
        $isAdmin     = $user->role->value   === 'administrateur';

        if (!$isOwner && !$isAgent && !$isAdmin) {
            abort(403, 'Accès non autorisé à ce document.');
        }

        if (!Storage::disk('local')->exists($document->chemin_stockage)) {
            abort(404, 'Fichier introuvable sur le serveur.');
        }

        return Storage::disk('local')->download(
            $document->chemin_stockage,
            $document->nom_original,
            ['Content-Type' => $document->type_mime]
        );
    }

    public function upload(Request $request)
    {
        $request->validate([
            'demande_uuid' => 'required|string',
            'document'     => 'required|file|max:10240|mimes:pdf,jpg,jpeg,png',
        ]);

        $demande = \App\Models\Demande::where('uuid', $request->demande_uuid)->firstOrFail();
        $user    = $request->user();

        // Seul le propriétaire ou un agent/admin peut uploader
        $canUpload = $demande->user_id === $user->id
            || in_array($user->role->value, ['agent', 'administrateur']);

        if (!$canUpload) {
            abort(403);
        }

        // Max 10 fichiers par demande
        if ($demande->documents()->count() >= 10) {
            return response()->json(['message' => 'Maximum 10 fichiers par demande atteint.'], 422);
        }

        $file = $request->file('document');
        $path = $file->store('documents/' . $demande->numero_dossier, 'local');

        $doc = $demande->documents()->create([
            'uploaded_by'      => $user->id,
            'nom_original'     => $file->getClientOriginalName(),
            'chemin_stockage'  => $path,
            'type_mime'        => $file->getMimeType(),
            'taille_octets'    => $file->getSize(),
            'type_document'    => \App\Enums\TypeDocumentEnum::PIECE_JUSTIFICATIVE,
            'is_validated'     => null,
        ]);

        return response()->json(['message' => 'Document uploadé.', 'document' => $doc], 201);
    }

    public function destroy(Request $request, $id)
    {
        $document = Document::findOrFail($id);
        $demande  = $document->demande;

        // Seul le propriétaire peut supprimer, uniquement avant traitement
        if ($demande->user_id !== $request->user()->id) {
            abort(403);
        }

        $statutValue = is_object($demande->statut) ? $demande->statut->value : $demande->statut;
        if (!in_array($statutValue, ['en_attente', 'document_manquant'])) {
            return response()->json(['message' => 'Impossible de supprimer un document après prise en charge.'], 422);
        }

        Storage::disk('local')->delete($document->chemin_stockage);
        $document->delete();

        return response()->json(['message' => 'Document supprimé.']);
    }
}
