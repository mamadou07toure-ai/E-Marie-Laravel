<?php

namespace App\Exports;

use App\Models\Demande;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class DossiersExport implements
    FromCollection,
    WithHeadings,
    WithMapping,
    WithStyles,
    WithTitle,
    ShouldAutoSize
{
    protected $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = Demande::with(['user', 'typeDemande', 'agent'])
            ->orderBy('created_at', 'desc');

        if (!empty($this->filters['statut'])) {
            $query->where('statut', $this->filters['statut']);
        }
        if (!empty($this->filters['search'])) {
            $query->whereHas('user', function ($q) {
                $q->where('nom', 'like', '%' . $this->filters['search'] . '%')
                  ->orWhere('prenom', 'like', '%' . $this->filters['search'] . '%');
            })->orWhere('numero_dossier', 'like', '%' . $this->filters['search'] . '%');
        }

        return $query->get();
    }

    public function headings(): array
    {
        return [
            'N° Dossier',
            'Citoyen',
            'Type de demande',
            'Statut',
            'Agent assigné',
            'Date de création',
            'Date de clôture',
        ];
    }

    public function map($demande): array
    {
        $statut = is_object($demande->statut) ? $demande->statut->value : $demande->statut;
        $statutLabels = [
            'en_attente'        => 'En attente',
            'en_cours'          => 'En cours',
            'validee'           => 'Validé',
            'rejetee'           => 'Rejeté',
            'document_manquant' => 'Pièce manquante',
        ];

        return [
            $demande->numero_dossier,
            $demande->user ? $demande->user->prenom . ' ' . $demande->user->nom : '—',
            $demande->typeDemande?->libelle ?? '—',
            $statutLabels[$statut] ?? $statut,
            $demande->agent ? $demande->agent->prenom . ' ' . $demande->agent->nom : 'Non assigné',
            $demande->created_at?->format('d/m/Y H:i'),
            $demande->date_cloture?->format('d/m/Y H:i') ?? '—',
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => [
                'font'      => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF']],
                'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF4F46E5']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ],
        ];
    }

    public function title(): string
    {
        return 'Dossiers';
    }
}
