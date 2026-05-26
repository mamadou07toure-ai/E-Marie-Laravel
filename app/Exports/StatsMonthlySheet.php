<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class StatsMonthlySheet implements FromArray, WithHeadings, WithTitle, ShouldAutoSize, WithStyles
{
    protected array $monthly;

    public function __construct(array $monthly)
    {
        $this->monthly = $monthly;
    }

    public function array(): array
    {
        return array_map(fn($row) => [$row['month'] ?? '', $row['count'] ?? 0], $this->monthly);
    }

    public function headings(): array
    {
        return ['Mois', 'Nombre de demandes'];
    }

    public function title(): string
    {
        return 'Par mois';
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
