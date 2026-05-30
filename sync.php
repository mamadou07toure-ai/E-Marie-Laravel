<?php
$demandes = \App\Models\Demande::all();
$count = 0;
foreach($demandes as $d) {
    if (empty($d->donnees_formulaire)) {
        $data = [];
        if ($d->naissance) { $data = $d->naissance->toArray(); }
        elseif ($d->residence) { $data = $d->residence->toArray(); }
        elseif ($d->mariage) { $data = $d->mariage->toArray(); }
        elseif ($d->legalisation) { $data = $d->legalisation->toArray(); }
        
        if (!empty($data)) {
            unset($data['id'], $data['demande_id'], $data['created_at'], $data['updated_at']);
            $d->donnees_formulaire = $data;
            $d->save();
            $count++;
        }
    }
}
echo "Synced {$count} records.\n";
