<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class ActivitiesExport implements FromCollection, WithHeadings, ShouldAutoSize
{
    protected $activities;

    public function __construct($activities)
    {
        $this->activities = $activities;
    }

    public function collection()
    {
        return collect($this->activities);
    }

    public function headings(): array
    {
        return [
            'Student',
            'Supervisor',
            'Activity Type',
            'Activity Name',
            'Status',
            'Start Date',
            'End Date'
        ];
    }
}
