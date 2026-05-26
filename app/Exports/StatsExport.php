<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class StatsExport implements WithMultipleSheets
{
    protected array $monthly;
    protected array $byType;

    public function __construct(array $monthly, array $byType)
    {
        $this->monthly = $monthly;
        $this->byType  = $byType;
    }

    public function sheets(): array
    {
        return [
            new StatsMonthlySheet($this->monthly),
            new StatsByTypeSheet($this->byType),
        ];
    }
}
