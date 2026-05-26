<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; color: #1e293b; background: #fff; }

        .header {
            background: #4f46e5;
            color: white;
            padding: 24px 32px;
            margin-bottom: 24px;
        }
        .header h1 { font-size: 20px; font-weight: bold; margin-bottom: 4px; }
        .header p  { font-size: 10px; opacity: 0.8; }

        .meta {
            display: flex;
            justify-content: space-between;
            padding: 0 32px;
            margin-bottom: 20px;
            font-size: 10px;
            color: #64748b;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            padding: 0 32px;
        }
        thead th {
            background: #4f46e5;
            color: white;
            padding: 10px 12px;
            text-align: left;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        tbody tr:nth-child(even) { background: #f8fafc; }
        tbody tr td {
            padding: 9px 12px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 10px;
        }

        .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 9999px;
            font-size: 9px;
            font-weight: bold;
        }
        .badge-validee           { background: #d1fae5; color: #065f46; }
        .badge-en_cours          { background: #dbeafe; color: #1e40af; }
        .badge-en_attente        { background: #f1f5f9; color: #475569; }
        .badge-rejetee           { background: #fee2e2; color: #991b1b; }
        .badge-document_manquant { background: #fef3c7; color: #92400e; }

        .footer {
            margin-top: 24px;
            padding: 12px 32px;
            border-top: 1px solid #e2e8f0;
            font-size: 9px;
            color: #94a3b8;
            text-align: center;
        }
        .total-row {
            padding: 10px 32px;
            margin-bottom: 16px;
            font-size: 11px;
            color: #4f46e5;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Registre des Dossiers — Smart e-Mairie</h1>
        <p>Mairie Digitale | Export officiel généré le {{ now()->format('d/m/Y à H:i') }}</p>
    </div>

    <div class="meta">
        <span>Généré par : {{ $generatedBy }}</span>
        <span>Total : {{ count($demandes) }} dossier{{ count($demandes) > 1 ? 's' : '' }}</span>
    </div>

    @php
    $statutLabels = [
        'en_attente'        => 'En attente',
        'en_cours'          => 'En cours',
        'validee'           => 'Validé',
        'rejetee'           => 'Rejeté',
        'document_manquant' => 'Pièce manquante',
    ];
    @endphp

    <table>
        <thead>
            <tr>
                <th>N° Dossier</th>
                <th>Citoyen</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Agent</th>
                <th>Date</th>
            </tr>
        </thead>
        <tbody>
            @forelse($demandes as $demande)
                @php
                    $statutValue = is_object($demande->statut) ? $demande->statut->value : $demande->statut;
                @endphp
                <tr>
                    <td><strong>{{ $demande->numero_dossier }}</strong></td>
                    <td>{{ $demande->user?->prenom }} {{ $demande->user?->nom }}</td>
                    <td>{{ $demande->typeDemande?->libelle ?? '—' }}</td>
                    <td>
                        <span class="badge badge-{{ $statutValue }}">
                            {{ $statutLabels[$statutValue] ?? $statutValue }}
                        </span>
                    </td>
                    <td>{{ $demande->agent ? $demande->agent->prenom . ' ' . $demande->agent->nom : 'Non assigné' }}</td>
                    <td>{{ $demande->created_at?->format('d/m/Y') }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" style="text-align:center; padding: 20px; color: #94a3b8;">Aucun dossier</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        Smart e-Mairie — Document généré automatiquement — Ne pas modifier
    </div>
</body>
</html>
