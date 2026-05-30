<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
    @page { margin: 0; size: A4; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DejaVu Sans', Arial, sans-serif; font-size: 9.5px; color: #1a1a2e; background: #fff; }

    /* === BANDE DE COULEUR PRINCIPALE === */
    .top-band {
        background: #0f3460;
        padding: 0 40px;
        height: 90px;
        position: relative;
        overflow: hidden;
    }
    .top-band::after {
        content: '';
        position: absolute;
        top: 0; right: 0;
        width: 220px; height: 90px;
        background: #e94560;
        clip-path: polygon(40px 0, 100% 0, 100% 100%, 0 100%);
    }
    .top-band-content {
        position: relative;
        z-index: 10;
        display: table;
        width: 100%;
        height: 90px;
    }
    .top-band-left { display: table-cell; vertical-align: middle; width: 55%; }
    .top-band-right { display: table-cell; vertical-align: middle; width: 45%; text-align: right; }

    .country-name { font-size: 13px; font-weight: 900; color: #ffffff; text-transform: uppercase; letter-spacing: 2px; }
    .country-motto { font-size: 8px; color: rgba(255,255,255,0.65); margin-top: 3px; font-style: italic; letter-spacing: 1px; }

    .flag-inline { display: inline-block; vertical-align: middle; margin-right: 10px; }
    .flag-inline table { border-collapse: collapse; }
    .flag-inline td { width: 14px; height: 26px; }
    .f-r { background: #ce1126; }
    .f-y { background: #fcd116; }
    .f-g { background: #009b48; }

    .doc-ref-box { text-align: right; }
    .doc-ref-box .ref-label { font-size: 8px; color: rgba(255,255,255,0.55); text-transform: uppercase; letter-spacing: 1px; }
    .doc-ref-box .ref-value { font-size: 10px; font-weight: 900; color: #fff; margin-top: 2px; font-family: monospace; }

    /* === BANDEAU TITRE === */
    .title-band {
        background: #f8f9fa;
        border-bottom: 1px solid #e2e8f0;
        padding: 16px 40px;
    }
    .doc-main-title { font-size: 19px; font-weight: 900; color: #0f3460; text-transform: uppercase; letter-spacing: 1px; }
    .doc-main-sub   { font-size: 8px; font-weight: 700; color: #e94560; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; }

    /* === CORPS DU DOCUMENT === */
    .body-wrap { padding: 20px 40px 200px 40px; }

    .cert-paragraph {
        font-size: 9.5px; color: #374151; line-height: 1.75;
        border-left: 3px solid #e94560; padding-left: 12px;
        margin-bottom: 20px; font-style: italic;
    }

    /* Sections */
    .section { margin-bottom: 18px; }
    .section-head {
        display: table; width: 100%; margin-bottom: 0;
    }
    .section-head-left {
        display: table-cell; background: #0f3460;
        color: white; font-size: 8px; font-weight: 900;
        text-transform: uppercase; letter-spacing: 1.5px;
        padding: 5px 14px; width: 55%;
    }
    .section-head-right {
        display: table-cell; background: #1a4a80;
        width: 45%;
    }

    /* Grille de données */
    .data-grid { width: 100%; border-collapse: collapse; }
    .data-grid tr { border-bottom: 1px solid #f1f5f9; }
    .data-grid tr:nth-child(even) td { background: #fafbfc; }
    .data-grid .k {
        width: 36%; font-size: 8px; font-weight: 700;
        color: #6b7280; text-transform: uppercase; letter-spacing: .3px;
        padding: 7px 14px; border-right: 2px solid #e94560;
        vertical-align: middle;
    }
    .data-grid .v {
        font-size: 11px; font-weight: 900; color: #111827;
        padding: 7px 14px; vertical-align: middle;
    }

    /* === PIED DE PAGE FIXE === */
    .footer-fixed {
        position: fixed;
        bottom: 0; left: 0; right: 0;
        height: 185px;
        background: #fff;
        border-top: 1px solid #e2e8f0;
        padding: 14px 40px 0 40px;
    }
    .footer-inner { display: table; width: 100%; }
    .foot-qr    { display: table-cell; width: 24%; vertical-align: top; }
    .foot-mid   { display: table-cell; width: 52%; vertical-align: top; text-align: center; padding: 0 20px; }
    .foot-sign  { display: table-cell; width: 24%; vertical-align: top; text-align: right; }

    .qr-img-box { border: 1px solid #e2e8f0; padding: 3px; display: inline-block; background: #fff; }
    .qr-caption { font-size: 7px; color: #9ca3af; margin-top: 4px; font-weight: 700; text-transform: uppercase; }
    .uuid-mono  { font-size: 6.5px; color: #0f3460; font-family: monospace; margin-top: 2px; }

    .seal-ring {
        width: 72px; height: 72px; border-radius: 50%;
        border: 2px solid #0f3460;
        margin: 0 auto 6px;
        text-align: center; padding-top: 12px;
        font-size: 7px; font-weight: 900; color: #0f3460; text-transform: uppercase;
        line-height: 1.4;
    }
    .seal-inner { border: 1px dashed #0f3460; border-radius: 50%; margin: 3px; padding: 6px 2px 2px; height: 60px; }

    .foot-legal {
        font-size: 7px; color: #9ca3af; text-align: center; text-transform: uppercase;
        letter-spacing: .5px; margin-top: 6px; border-top: 1px dashed #e2e8f0; padding-top: 6px;
    }

    .sign-label { font-size: 8.5px; font-weight: 900; color: #0f3460; text-transform: uppercase; }
    .sign-city  { font-size: 7.5px; color: #6b7280; font-style: italic; margin-top: 2px; }
    .sign-space { height: 40px; border-bottom: 1px dashed #9ca3af; margin: 8px 0 0; }
    .sign-note  { font-size: 7px; color: #9ca3af; margin-top: 3px; }

    /* Filet séparateur bas page */
    .bottom-accent { position: fixed; bottom: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, #0f3460, #e94560); }
</style>
</head>
<body>
@php
    $d = $demande->donnees_formulaire ?? [];
    \Carbon\Carbon::setLocale('fr');
@endphp

<!-- PIED DE PAGE FIXE -->
<div class="footer-fixed">
    <div class="footer-inner">
        <div class="foot-qr">
            <div class="qr-img-box">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=75x75&data={{ urlencode(config('app.url').'/verify/'.$demande->uuid) }}" width="75" height="75"/>
            </div>
            <div class="qr-caption">Vérification officielle</div>
            <div class="uuid-mono">{{ substr($demande->uuid, 0, 24) }}...</div>
        </div>
        <div class="foot-mid">
            <div class="seal-ring">
                <div class="seal-inner">MAIRIE<br>KALOUM<br>&#9733;</div>
            </div>
            <div class="foot-legal">
                Dossier : {{ $demande->numero_dossier }} &mdash; Smart e-Mairie &middot; République de Guinée<br>
                Toute falsification ou altération de ce document est punie par la loi.
            </div>
        </div>
        <div class="foot-sign">
            <div class="sign-label">L'Officier de l'État Civil</div>
            <div class="sign-city">Kaloum, le {{ now()->format('d/m/Y') }}</div>
            <div class="sign-space"></div>
            <div class="sign-note">(Signature et Cachet Officiel)</div>
        </div>
    </div>
</div>

<div class="bottom-accent"></div>

<!-- EN-TÊTE COLORÉ -->
<div class="top-band">
    <div class="top-band-content">
        <div class="top-band-left">
            <div class="flag-inline">
                <table><tr><td class="f-r"></td><td class="f-y"></td><td class="f-g"></td></tr></table>
            </div>
            <div style="display:inline-block; vertical-align:middle;">
                <div class="country-name">République de Guinée</div>
                <div class="country-motto">Travail &middot; Justice &middot; Solidarité</div>
                <div style="font-size:7.5px; color:rgba(255,255,255,0.5); margin-top:5px; text-transform:uppercase; letter-spacing:1px;">
                    Ministère de l'Administration du Territoire<br>
                    Commune de Kaloum — Service de l'État Civil
                </div>
            </div>
        </div>
        <div class="top-band-right">
            <div class="doc-ref-box">
                <div class="ref-label">Acte N°</div>
                <div class="ref-value">ACTE-{{ str_pad($demande->id, 6, '0', STR_PAD_LEFT) }}</div>
                <div class="ref-label" style="margin-top:6px;">Dossier</div>
                <div class="ref-value">{{ $demande->numero_dossier }}</div>
            </div>
        </div>
    </div>
</div>

<!-- TITRE -->
<div class="title-band">
    <div class="doc-main-title">Extrait d'Acte de Naissance</div>
    <div class="doc-main-sub">Copie intégrale certifiée conforme &mdash; {{ now()->format('Y') }}</div>
</div>

<!-- CORPS -->
<div class="body-wrap">
    <p class="cert-paragraph">
        Le Maire de la Commune de Kaloum, Officier de l'État Civil, certifie et atteste que les informations consignées ci-dessous sont extraites des registres officiels de l'état civil, et sont reconnues exactes et conformes à la déclaration originelle.
    </p>

    <div class="section">
        <div class="section-head">
            <div class="section-head-left">Identité de l'Enfant</div>
            <div class="section-head-right"></div>
        </div>
        <table class="data-grid">
            <tr><td class="k">Nom de famille</td><td class="v">{{ strtoupper($d['nom'] ?? '—') }}</td></tr>
            <tr><td class="k">Prénom(s)</td><td class="v">{{ mb_convert_case($d['prenom'] ?? '—', MB_CASE_TITLE, 'UTF-8') }}</td></tr>
            <tr><td class="k">Sexe</td><td class="v">{{ ($d['genre'] ?? '') === 'M' ? 'MASCULIN' : (($d['genre'] ?? '') === 'F' ? 'FÉMININ' : '—') }}</td></tr>
            <tr><td class="k">Date de naissance</td><td class="v">{{ !empty($d['date_naissance']) ? \Carbon\Carbon::parse($d['date_naissance'])->isoFormat('D MMMM YYYY') : '—' }}</td></tr>
            <tr><td class="k">Lieu de naissance</td><td class="v">{{ strtoupper($d['lieu_naissance'] ?? '—') }}</td></tr>
        </table>
    </div>

    <div class="section">
        <div class="section-head">
            <div class="section-head-left">Filiation Paternelle</div>
            <div class="section-head-right"></div>
        </div>
        <table class="data-grid">
            <tr><td class="k">Nom et Prénom(s)</td><td class="v">{{ strtoupper($d['nom_pere'] ?? '—') }} {{ mb_convert_case($d['prenom_pere'] ?? '', MB_CASE_TITLE, 'UTF-8') }}</td></tr>
            <tr><td class="k">Date de naissance</td><td class="v">{{ !empty($d['date_naissance_pere']) ? \Carbon\Carbon::parse($d['date_naissance_pere'])->isoFormat('D MMMM YYYY') : '—' }}</td></tr>
            <tr><td class="k">Profession</td><td class="v">{{ mb_convert_case($d['profession_pere'] ?? '—', MB_CASE_TITLE, 'UTF-8') }}</td></tr>
        </table>
    </div>

    <div class="section">
        <div class="section-head">
            <div class="section-head-left">Filiation Maternelle</div>
            <div class="section-head-right"></div>
        </div>
        <table class="data-grid">
            <tr><td class="k">Nom et Prénom(s)</td><td class="v">{{ strtoupper($d['nom_mere'] ?? '—') }} {{ mb_convert_case($d['prenom_mere'] ?? '', MB_CASE_TITLE, 'UTF-8') }}</td></tr>
            <tr><td class="k">Date de naissance</td><td class="v">{{ !empty($d['date_naissance_mere']) ? \Carbon\Carbon::parse($d['date_naissance_mere'])->isoFormat('D MMMM YYYY') : '—' }}</td></tr>
            <tr><td class="k">Profession</td><td class="v">{{ mb_convert_case($d['profession_mere'] ?? '—', MB_CASE_TITLE, 'UTF-8') }}</td></tr>
        </table>
    </div>

    <div class="section">
        <div class="section-head">
            <div class="section-head-left">Informations Complémentaires</div>
            <div class="section-head-right"></div>
        </div>
        <table class="data-grid">
            <tr><td class="k">Motif de délivrance</td><td class="v">{{ $d['motif'] ?? '—' }}</td></tr>
            <tr><td class="k">Nombre de copies</td><td class="v">{{ $d['nombre_copies'] ?? '1' }}</td></tr>
        </table>
    </div>
</div>

</body>
</html>
