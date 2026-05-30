<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
    @page { margin: 0; size: A4; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DejaVu Sans', Arial, sans-serif; font-size: 9.5px; color: #1e293b; background: #fff; }

    /* === BANDE SUPÉRIEURE MARINE === */
    .top-band { background: #0f3460; padding: 0 40px; height: 70px; position: relative; overflow: hidden; }
    .top-band::after { content: ''; position: absolute; top: 0; right: 0; width: 160px; height: 70px; background: #16c79a; clip-path: polygon(30px 0, 100% 0, 100% 100%, 0 100%); }
    .top-band-content { position: relative; z-index: 10; display: table; width: 100%; height: 70px; }
    .top-band-left  { display: table-cell; vertical-align: middle; width: 60%; }
    .top-band-right { display: table-cell; vertical-align: middle; width: 40%; text-align: right; }

    .brand-name { font-size: 18px; font-weight: 900; color: #fff; letter-spacing: -0.5px; }
    .brand-sub  { font-size: 8px; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 2px; margin-top: 3px; }
    .doc-type   { font-size: 14px; font-weight: 900; color: #fff; text-transform: uppercase; letter-spacing: 1px; }
    .doc-gen    { font-size: 7.5px; color: rgba(255,255,255,0.6); margin-top: 3px; }

    /* === INFO CARDS === */
    .cards-section { background: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 16px 40px; }
    .cards-row { width: 100%; border-collapse: separate; border-spacing: 10px 0; }
    .card-box { background: #fff; border: 1px solid #e2e8f0; border-top: 3px solid #0f3460; padding: 12px 14px; vertical-align: top; }
    .card-label { font-size: 7.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 5px; }
    .card-value { font-size: 14px; font-weight: 900; color: #0f172a; }
    .card-mono  { font-family: monospace; font-size: 15px; color: #0f3460; }
    .card-sub   { font-size: 8px; color: #94a3b8; margin-top: 3px; }
    .badge-ready { display: inline-block; background: #dcfce7; border: 1px solid #86efac; color: #166534; font-size: 7.5px; font-weight: 900; text-transform: uppercase; padding: 2px 8px; margin-top: 6px; letter-spacing: .5px; }

    /* === SECTION DETAILS === */
    .details-section { padding: 16px 40px; }
    .detail-head { background: #0f3460; color: white; font-size: 8px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; padding: 6px 14px; margin-bottom: 0; }
    .detail-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    .detail-table th { background: #1e3a5f; color: rgba(255,255,255,0.8); font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 7px 14px; text-align: left; }
    .detail-table td { font-size: 11px; font-weight: 700; color: #1e293b; padding: 9px 14px; border-bottom: 1px solid #f1f5f9; background: #fafafa; }

    /* === INSTRUCTIONS === */
    .instr-box { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 14px 18px; margin: 0 40px 20px; }
    .instr-title { font-size: 9px; font-weight: 900; color: #92400e; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
    .instr-list { padding-left: 18px; }
    .instr-list li { font-size: 9px; color: #78350f; margin-bottom: 6px; line-height: 1.5; }

    /* === BAS DE PAGE === */
    .bottom-section { padding: 0 40px 20px; }
    .barcode-qr-row { display: table; width: 100%; }
    .barcode-cell { display: table-cell; vertical-align: bottom; width: 55%; }
    .qr-cell      { display: table-cell; vertical-align: bottom; width: 45%; text-align: right; }

    .barcode-mono  { font-family: monospace; font-size: 24px; letter-spacing: 4px; color: #0f172a; }
    .barcode-label { font-size: 7.5px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }

    .qr-img-wrap  { border: 1px solid #e2e8f0; padding: 4px; display: inline-block; background: #fff; }
    .qr-cap       { font-size: 7px; color: #94a3b8; text-align: right; margin-top: 3px; font-weight: 700; text-transform: uppercase; }

    /* Ligne de découpe et pied */
    .cut-rule { border-top: 1px dashed #cbd5e1; margin: 18px 40px 8px; }
    .cut-label { text-align: center; font-size: 8px; color: #cbd5e1; letter-spacing: 1px; }

    /* Bandeau bas couleur */
    .bottom-accent { position: fixed; bottom: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, #0f3460, #16c79a); }
</style>
</head>
<body>
@php
    $d = $demande->donnees_formulaire ?? [];
    $prenom = $d['prenom'] ?? $demande->user->prenom;
    $nom    = strtoupper($d['nom'] ?? $demande->user->nom);
@endphp

<div class="bottom-accent"></div>

<!-- EN-TÊTE -->
<div class="top-band">
    <div class="top-band-content">
        <div class="top-band-left">
            <div class="brand-name">&#9733; Smart e-Mairie</div>
            <div class="brand-sub">Mairie de Kaloum &middot; Service État Civil &middot; République de Guinée</div>
        </div>
        <div class="top-band-right">
            <div class="doc-type">Bon de Retrait</div>
            <div class="doc-gen">Généré le {{ now()->format('d/m/Y à H:i') }}</div>
        </div>
    </div>
</div>

<!-- CARTES -->
<div class="cards-section">
    <table class="cards-row">
        <tr>
            <td class="card-box" style="width:48%;">
                <div class="card-label">Numéro de dossier</div>
                <div class="card-value card-mono">{{ $demande->numero_dossier }}</div>
                <div class="badge-ready">&#10003; Prêt pour le retrait</div>
            </td>
            <td class="card-box" style="width:52%;">
                <div class="card-label">Bénéficiaire</div>
                <div class="card-value">{{ $prenom }} {{ $nom }}</div>
                <div class="card-sub">Contact : {{ $demande->user->telephone ?? 'Non renseigné' }}</div>
            </td>
        </tr>
    </table>
</div>

<!-- TABLEAU DE DÉTAILS -->
<div class="details-section">
    <table class="detail-table">
        <thead>
            <tr>
                <th style="width:55%;">Type de document à retirer</th>
                <th style="width:45%;">Date de validation du dossier</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ $demande->typeDemande->libelle ?? '—' }}</td>
                <td>{{ $demande->date_cloture ? $demande->date_cloture->format('d/m/Y') : now()->format('d/m/Y') }}</td>
            </tr>
        </tbody>
    </table>
</div>

<!-- INSTRUCTIONS -->
<div class="instr-box">
    <div class="instr-title">&#128203; Instructions pour le retrait au guichet</div>
    <ul class="instr-list">
        <li>Présentez ce bon de retrait (imprimé ou affiché sur votre téléphone) au guichet de la <strong>Mairie de Kaloum</strong>.</li>
        <li>Munissez-vous obligatoirement d'une <strong>pièce d'identité officielle en cours de validité</strong> (Carte Nationale d'Identité, Passeport).</li>
        <li>En cas de retrait par un tiers, une <strong>procuration dûment légalisée</strong> est exigée, accompagnée de la pièce d'identité du mandataire.</li>
        <li><strong>Horaires :</strong> Du Lundi au Vendredi — 08h30 à 16h00 (hors jours fériés officiels).</li>
    </ul>
</div>

<!-- CODE-BARRES + QR -->
<div class="bottom-section">
    <div class="barcode-qr-row">
        <div class="barcode-cell">
            <div class="barcode-mono">*{{ $demande->numero_dossier }}*</div>
            <div class="barcode-label">Code de suivi interne — Smart e-Mairie</div>
        </div>
        <div class="qr-cell">
            <div class="qr-img-wrap">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=85x85&data={{ urlencode(config('app.url').'/verify/'.$demande->uuid) }}" width="85" height="85"/>
            </div>
            <div class="qr-cap">Scan de vérification officielle</div>
        </div>
    </div>
</div>

<div class="cut-rule"></div>
<div class="cut-label">&#9986;&nbsp;&nbsp;Ce document fait foi de votre droit au retrait — Ne pas perdre&nbsp;&nbsp;&#9986;</div>

</body>
</html>
