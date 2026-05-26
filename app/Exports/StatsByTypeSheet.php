<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class StatsByTypeSheet implements FromArray, WithHeadings, WithTitle, ShouldAutoSize, WithStyles
{
    protected array $byType;

    public function __construct(array $byType)
    {
        $this->byType = $byType;
    }

    public function array(): array
    {
        return array_map(fn($row) => [$row['libelle'] ?? '', $row['count'] ?? 0], $this->byType);
    }

    public function headings(): array
    {
        return ['Type de demande', 'Nombre'];
    }

    public function title(): string
    {
        return 'Par type';
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => [
                'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF4F46E5']],
            ],
        ];
    }
}
