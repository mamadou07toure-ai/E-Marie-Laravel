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
            padding: 0 32px;
            margin-bottom: 20px;
            font-size: 10px;
            color: #64748b;
        }

        .grid {
            display: flex;
            gap: 16px;
            padding: 0 32px;
            margin-bottom: 24px;
        }
        .kpi-card {
            flex: 1;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
            text-align: center;
        }
        .kpi-card .value { font-size: 28px; font-weight: bold; color: #4f46e5; }
        .kpi-card .label { font-size: 9px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px; }

        h2 {
            padding: 0 32px;
            font-size: 13px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 2px solid #4f46e5;
        }

        table {
            width: calc(100% - 64px);
            margin: 0 32px;
            border-collapse: collapse;
            margin-bottom: 24px;
        }
        thead th {
            background: #4f46e5;
            color: white;
            padding: 9px 12px;
            text-align: left;
            font-size: 9px;
            text-transform: uppercase;
        }
        tbody tr:nth-child(even) { background: #f8fafc; }
        tbody td {
            padding: 8px 12px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 10px;
        }

        .bar-row { margin-bottom: 12px; padding: 0 32px; }
        .bar-label { font-size: 10px; color: #475569; margin-bottom: 4px; display: flex; justify-content: space-between; }
        .bar-bg { background: #e2e8f0; border-radius: 4px; height: 8px; overflow: hidden; }
        .bar-fill { height: 100%; background: #4f46e5; border-radius: 4px; }

        .footer {
            margin-top: 24px;
            padding: 12px 32px;
            border-top: 1px solid #e2e8f0;
            font-size: 9px;
            color: #94a3b8;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Rapport Statistique — Smart e-Mairie</h1>
        <p>Mairie Digitale | Export officiel généré le {{ now()->format('d/m/Y à H:i') }}</p>
    </div>

    <div class="meta">
        Généré par : {{ $generatedBy }}
    </div>

    {{-- KPIs --}}
    <div class="grid">
        <div class="kpi-card">
            <div class="value">{{ $extra['total_demandes'] ?? 0 }}</div>
            <div class="label">Total dossiers</div>
        </div>
        <div class="kpi-card">
            <div class="value">{{ $extra['validees'] ?? 0 }}</div>
            <div class="label">Validés</div>
        </div>
        <div class="kpi-card">
            <div class="value">{{ $extra['en_cours'] ?? 0 }}</div>
            <div class="label">En cours</div>
        </div>
        <div class="kpi-card">
            <div class="value">{{ $extra['success_rate'] ?? '0%' }}</div>
            <div class="label">Taux de traitement</div>
        </div>
    </div>

    {{-- Par mois --}}
    <h2>Activité mensuelle</h2>
    <table>
        <thead>
            <tr>
                <th>Mois</th>
                <th>Nombre de demandes</th>
            </tr>
        </thead>
        <tbody>
            @forelse($monthly as $row)
                <tr>
                    <td>{{ $row['month'] ?? '' }}</td>
                    <td><strong>{{ $row['count'] ?? 0 }}</strong></td>
                </tr>
            @empty
                <tr><td colspan="2" style="text-align:center; color:#94a3b8; padding:16px;">Aucune donnée</td></tr>
            @endforelse
        </tbody>
    </table>

    {{-- Par type --}}
    <h2>Répartition par type de demande</h2>
    @php $maxByType = collect($byType)->max('count') ?: 1; @endphp
    @foreach($byType as $row)
        <div class="bar-row">
            <div class="bar-label">
                <span>{{ $row['libelle'] ?? '' }}</span>
                <span><strong>{{ $row['count'] ?? 0 }}</strong></span>
            </div>
            <div class="bar-bg">
                <div class="bar-fill" style="width: {{ min(round(($row['count'] / $maxByType) * 100), 100) }}%;"></div>
            </div>
        </div>
    @endforeach

    <div class="footer">
        Smart e-Mairie — Document généré automatiquement — Ne pas modifier
    </div>
</body>
</html>
