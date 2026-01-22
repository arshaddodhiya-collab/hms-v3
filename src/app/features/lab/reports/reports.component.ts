import { Component, OnInit } from '@angular/core';

interface LabReport {
  id: string;
  patientName: string;
  testName: string;
  dateCompleted: string;
  status: 'Finalized';
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
})
export class ReportsComponent implements OnInit {
  reports: LabReport[] = [];

  constructor() {}

  ngOnInit() {
    this.reports = [
      {
        id: 'RPT-1001',
        patientName: 'Alice Green',
        testName: 'Thyroid Profile',
        dateCompleted: '2023-10-24',
        status: 'Finalized',
      },
      {
        id: 'RPT-1002',
        patientName: 'Tom White',
        testName: 'Urine Analysis',
        dateCompleted: '2023-10-24',
        status: 'Finalized',
      },
    ];
  }
}
