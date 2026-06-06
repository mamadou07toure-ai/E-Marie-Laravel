<?php

namespace App\Services;

use App\Models\Demande;
use App\Models\DocumentTemplate;
use Barryvdh\DomPDF\Facade\Pdf;

class DocumentGeneratorService
{
    /**
     * Génère le PDF d'un dossier validé à partir de son template image.
     * Retourne le contenu binaire du PDF.
     */
    public function generer(Demande $demande): string
    {
        $template = DocumentTemplate::where('type_demande_id', $demande->type_demande_id)
            ->where('actif', true)
            ->firstOrFail();

        $champs  = $template->champs ?? [];
        $donnees = $this->extraireDonnees($demande);
        $imageUrl = public_path('storage/' . $template->chemin_image);

        // Encode l'image en base64 pour l'intégrer dans le HTML (dompdf ne suit pas les chemins locaux)
        $ext      = strtolower(pathinfo($imageUrl, PATHINFO_EXTENSION));
        $mime     = in_array($ext, ['jpg', 'jpeg']) ? 'image/jpeg' : 'image/png';
        $b64      = base64_encode(file_get_contents($imageUrl));
        $imageSrc = "data:{$mime};base64,{$b64}";

        $html = $this->buildHtml($imageSrc, $champs, $donnees);

        $pdf = Pdf::loadHTML($html)
            ->setPaper('a4', 'portrait')
            ->setOptions([
                'isRemoteEnabled' => true,
                'defaultFont'     => 'DejaVu Sans',
                'isHtml5ParserEnabled' => true,
            ]);

        return $pdf->output();
    }

    private function buildHtml(string $imageSrc, array $champs, array $donnees): string
    {
        $fieldsHtml = '';
        foreach ($champs as $champ) {
            $valeur    = $donnees[$champ['key']] ?? '';
            $fontSize  = $champ['font_size'] ?? 12;
            $color     = $champ['color'] ?? '#000000';
            $bold      = !empty($champ['bold']) ? 'font-weight:bold;' : '';
            $x         = (float) ($champ['x'] ?? 0);
            $y         = (float) ($champ['y'] ?? 0);

            $fieldsHtml .= sprintf(
                '<div style="position:absolute;left:%s%%;top:%s%%;font-size:%spx;color:%s;%s white-space:nowrap;">%s</div>',
                $x, $y, $fontSize, htmlspecialchars($color), $bold, htmlspecialchars($valeur)
            );
        }

        return <<<HTML
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:210mm; height:297mm; }
  .page { position:relative; width:210mm; height:297mm; overflow:hidden; }
  .page img { position:absolute; top:0; left:0; width:100%; height:100%; }
  .fields { position:absolute; top:0; left:0; width:100%; height:100%; }
</style>
</head>
<body>
  <div class="page">
    <img src="{$imageSrc}" />
    <div class="fields">
      {$fieldsHtml}
    </div>
  </div>
</body>
</html>
HTML;
    }

    /**
     * Extrait toutes les variables disponibles depuis une demande.
     */
    private function extraireDonnees(Demande $demande): array
    {
        $data = [
            'numero_dossier'   => $demande->numero_dossier,
            'date_depot'       => $demande->created_at?->format('d/m/Y'),
            'date_validation'  => $demande->date_cloture?->format('d/m/Y') ?? now()->format('d/m/Y'),
            'citoyen_prenom'   => $demande->user?->prenom,
            'citoyen_nom'      => $demande->user?->nom,
            'citoyen_email'    => $demande->user?->email,
            'agent_prenom'     => $demande->agent?->prenom,
            'agent_nom'        => $demande->agent?->nom,
            'type_demande'     => $demande->typeDemande?->libelle,
        ];

        // Acte de naissance
        if ($demande->naissance) {
            $n = $demande->naissance;
            $data = array_merge($data, [
                'nom'              => $n->nom,
                'prenoms'          => $n->prenoms,
                'date_naissance'   => $n->date_naissance,
                'lieu_naissance'   => $n->lieu_naissance,
                'genre'            => $n->genre === 'M' ? 'Masculin' : 'Féminin',
                'nom_pere'         => $n->nom_pere,
                'prenom_pere'      => $n->prenom_pere,
                'profession_pere'  => $n->profession_pere,
                'nom_mere'         => $n->nom_mere,
                'prenom_mere'      => $n->prenom_mere,
                'profession_mere'  => $n->profession_mere,
                'motif'            => $n->motif,
                'nombre_copies'    => $n->nombre_copies,
            ]);
        }

        // Certificat de résidence
        if ($demande->residence) {
            $r = $demande->residence;
            $data = array_merge($data, [
                'nom'               => $r->nom,
                'prenoms'           => $r->prenoms,
                'date_naissance'    => $r->date_naissance,
                'lieu_naissance'    => $r->lieu_naissance,
                'adresse_complete'  => $r->adresse_complete,
                'quartier_commune'  => $r->quartier_commune,
                'duree_residence'   => $r->duree_residence,
                'profession'        => $r->profession,
                'motif'             => $r->motif,
                'nombre_copies'     => $r->nombre_copies,
            ]);
        }

        // Certificat de mariage
        if ($demande->mariage) {
            $m = $demande->mariage;
            $data = array_merge($data, [
                'nom_epoux'              => $m->nom_epoux,
                'prenom_epoux'           => $m->prenom_epoux,
                'date_naissance_epoux'   => $m->date_naissance_epoux,
                'lieu_naissance_epoux'   => $m->lieu_naissance_epoux,
                'nom_epouse'             => $m->nom_epouse,
                'prenom_epouse'          => $m->prenom_epouse,
                'date_naissance_epouse'  => $m->date_naissance_epouse,
                'lieu_naissance_epouse'  => $m->lieu_naissance_epouse,
                'date_mariage'           => $m->date_mariage,
                'lieu_mariage'           => $m->lieu_mariage,
                'numero_acte_mariage'    => $m->numero_acte_mariage,
                'motif'                  => $m->motif,
                'nombre_copies'          => $m->nombre_copies,
            ]);
        }

        // Légalisation
        if ($demande->legalisation) {
            $l = $demande->legalisation;
            $data = array_merge($data, [
                'nom'                  => $l->nom,
                'prenoms'              => $l->prenoms,
                'type_document'        => $l->type_document,
                'description_document' => $l->description_document,
                'langue_document'      => $l->langue_document,
                'pays_destination'     => $l->pays_destination,
                'usage_prevu'          => $l->usage_prevu,
                'nombre_copies'        => $l->nombre_copies,
            ]);
        }

        return $data;
    }
}
