<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DejaVu Sans', sans-serif; color: #1e293b; background: #ffffff; font-size: 11px; }
        .page { width: 100%; padding: 40px 48px; position: relative; }
        .watermark {
            position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%) rotate(-35deg);
            font-size: 60px; font-weight: 900; color: rgba(16, 185, 129, 0.05);
            letter-spacing: 6px; text-transform: uppercase; white-space: nowrap;
        }
        /* Header */
        .header { display: table; width: 100%; border-bottom: 3px solid #10b981; padding-bottom: 20px; margin-bottom: 28px; }
        .header-left { display: table-cell; width: 55%; vertical-align: middle; }
        .header-right { display: table-cell; width: 45%; vertical-align: middle; text-align: right; }
        .mairie-name { font-size: 20px; font-weight: 900; color: #059669; letter-spacing: -0.5px; }
        .mairie-sub { font-size: 9px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-top: 3px; }
        .doc-title { font-size: 13px; font-weight: 900; color: #1e293b; text-transform: uppercase; letter-spacing: 1px; }
        .doc-sub { font-size: 9px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 3px; }

        /* Certified badge */
        .certified {
            background: linear-gradient(135deg, #059669, #10b981);
            color: white; text-align: center;
            padding: 16px 20px; border-radius: 12px; margin-bottom: 28px;
        }
        .certified .label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 3px; opacity: 0.85; }
        .certified .value { font-size: 22px; font-weight: 900; letter-spacing: 3px; margin-top: 4px; }
        .certified .sub { font-size: 9px; opacity: 0.75; margin-top: 6px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }

        /* Info grid */
        .info-grid { display: table; width: 100%; margin-bottom: 12px; border-collapse: separate; border-spacing: 8px; }
        .info-row { display: table-row; }
        .info-cell { display: table-cell; width: 50%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 16px; vertical-align: top; }
        .info-label { font-size: 8px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8; margin-bottom: 5px; }
        .info-value { font-size: 13px; font-weight: 900; color: #1e293b; }

        /* Auth section */
        .auth-box {
            background: #f0fdf4; border: 2px solid #bbf7d0;
            border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;
        }
        .auth-title { font-size: 10px; font-weight: 900; color: #059669; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; }
        .auth-row { display: table; width: 100%; margin-bottom: 8px; }
        .auth-key { display: table-cell; width: 40%; font-size: 9px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; }
        .auth-val { display: table-cell; width: 60%; font-size: 10px; font-weight: 900; color: #111827; }

        /* QR section */
        .qr-section { display: table; width: 100%; margin-bottom: 24px; }
        .qr-left { display: table-cell; width: 60%; vertical-align: middle; padding-right: 24px; }
        .qr-right { display: table-cell; width: 40%; vertical-align: middle; text-align: center; }
        .qr-note { font-size: 9px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; }

        /* Official stamp area */
        .stamp-grid { display: table; width: 100%; border-top: 2px solid #f1f5f9; padding-top: 20px; }
        .stamp-cell { display: table-cell; width: 50%; vertical-align: top; padding: 0 12px; }
        .stamp-cell:first-child { padding-left: 0; }
        .stamp-cell:last-child { padding-right: 0; text-align: right; }
        .stamp-label { font-size: 8px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8; margin-bottom: 48px; }
        .stamp-line { border-top: 1.5px dashed #cbd5e1; padding-top: 8px; font-size: 9px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }

        /* Footer */
        .footer {
            position: fixed; bottom: 0; left: 48px; right: 48px;
            border-top: 1px solid #f1f5f9; padding: 12px 0; display: table;
            width: calc(100% - 96px);
        }
        .footer-left { display: table-cell; font-size: 8px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
        .footer-right { display: table-cell; text-align: right; font-size: 8px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }

        .valid-stamp {
            display: inline-block;
            border: 3px solid #059669;
            color: #059669;
            padding: 6px 16px;
            font-size: 12px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 3px;
            border-radius: 6px;
            transform: rotate(-5deg);
            margin-top: 8px;
        }
    </style>
</head>
<body>
    <div class="watermark">DOCUMENT OFFICIEL</div>

    <div class="page">
        <!-- Header -->
        <div class="header">
            <div class="header-left">
                <div class="mairie-name">★ Smart e-Mairie</div>
                <div class="mairie-sub">République de Guinée · Mairie de Kaloum</div>
            </div>
            <div class="header-right">
                <div class="doc-title">{{ $demande->typeDemande->libelle }}</div>
                <div class="doc-sub">Document Officiel Certifié Numérique</div>
            </div>
        </div>

        <!-- Certified Badge -->
        <div class="certified">
            <div class="label">Dossier Officiel N°</div>
            <div class="value">{{ $demande->numero_dossier }}</div>
            <div class="sub">✓ Validé &amp; Certifié par la Mairie de Kaloum</div>
        </div>

        <!-- Citizen Info -->
        <div class="info-grid">
            <div class="info-row">
                <div class="info-cell">
                    <div class="info-label">Bénéficiaire</div>
                    <div class="info-value">{{ $demande->user->prenom }} {{ $demande->user->nom }}</div>
                </div>
                <div class="info-cell">
                    <div class="info-label">Service demandé</div>
                    <div class="info-value">{{ $demande->typeDemande->libelle }}</div>
                </div>
            </div>
        </div>
        <div class="info-grid">
            <div class="info-row">
                <div class="info-cell">
                    <div class="info-label">Date de demande</div>
                    <div class="info-value">{{ $demande->created_at->format('d/m/Y') }}</div>
                </div>
                <div class="info-cell">
                    <div class="info-label">Date de validation</div>
                    <div class="info-value">{{ $demande->date_cloture ? $demande->date_cloture->format('d/m/Y') : now()->format('d/m/Y') }}</div>
                </div>
            </div>
        </div>

        @if($demande->agent)
        <div class="info-grid">
            <div class="info-row">
                <div class="info-cell">
                    <div class="info-label">Agent validateur</div>
                    <div class="info-value">{{ $demande->agent->prenom }} {{ $demande->agent->nom }}</div>
                </div>
                <div class="info-cell">
                    <div class="info-label">Mode de délivrance</div>
                    <div class="info-value">Téléchargement Numérique</div>
                </div>
            </div>
        </div>
        @endif

        <!-- Authenticity Block -->
        <div class="auth-box">
            <div class="auth-title">🔒 Certificat d'Authenticité Numérique</div>
            <div class="auth-row">
                <div class="auth-key">Identifiant UUID</div>
                <div class="auth-val">{{ $demande->uuid }}</div>
            </div>
            <div class="auth-row">
                <div class="auth-key">Généré le</div>
                <div class="auth-val">{{ now()->format('d/m/Y à H:i:s') }}</div>
            </div>
            <div class="auth-row">
                <div class="auth-key">Vérification</div>
                <div class="auth-val">{{ config('app.url') }}/verify/demandes/{{ $demande->uuid }}</div>
            </div>
        </div>

        <!-- QR + Statement -->
        <div class="qr-section">
            <div class="qr-left">
                <p style="font-size: 11px; color: #374151; line-height: 1.8; font-weight: 700;">
                    La Mairie de Kaloum certifie que le présent document
                    <strong style="color: #059669;">{{ $demande->typeDemande->libelle }}</strong>
                    a été délivré conformément aux textes et règlements en vigueur, au nom de
                    <strong>{{ $demande->user->prenom }} {{ $demande->user->nom }}</strong>,
                    et que toutes les informations contenues dans ce dossier ont été vérifiées et
                    authentifiées par les agents compétents.
                </p>
            </div>
            <div class="qr-right">
                <div class="qr-note">QR de Vérification</div>
                <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data={{ urlencode(config('app.url') . '/verify/demandes/' . $demande->uuid) }}"
                    alt="QR Code"
                    style="width: 100px; height: 100px; border: 4px solid #d1fae5; border-radius: 10px; padding: 4px;"
                />
            </div>
        </div>

        <!-- Signatures -->
        <div class="stamp-grid">
            <div class="stamp-cell">
                <div class="stamp-label">Le Bénéficiaire</div>
                <div class="stamp-line">{{ $demande->user->prenom }} {{ $demande->user->nom }}</div>
            </div>
            <div class="stamp-cell">
                <div class="stamp-label">La Mairie de Kaloum</div>
                <div class="valid-stamp">VALIDÉ</div>
                <div class="stamp-line" style="margin-top: 10px;">Cachet Officiel · Direction État Civil</div>
            </div>
        </div>
    </div>

    <div class="footer">
        <div class="footer-left">Smart e-Mairie · Portail Digital · mairie.gov.gn</div>
        <div class="footer-right">Document généré le {{ now()->format('d/m/Y à H:i') }} · Certifié conforme</div>
    </div>
</body>
</html>
