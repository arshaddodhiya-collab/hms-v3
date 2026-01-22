import { Component, OnInit } from '@angular/core';

interface VitalSign {
  patientName: string;
  bp: string;
  pulse: string;
  temp: string;
  spo2: string;
  timestamp: string;
}

@Component({
  selector: 'app-vitals',
  templateUrl: './vitals.component.html',
})
export class VitalsComponent implements OnInit {
  vitalsList: VitalSign[] = [];
  displayAddDialog: boolean = false;
  // Mock model for new entry
  newVital: any = {};

  constructor() {}

  ngOnInit() {
    // Mock data
    this.vitalsList = [
      {
        patientName: 'Alice Green',
        bp: '120/80',
        pulse: '72',
        temp: '98.6',
        spo2: '98',
        timestamp: '2023-10-27 08:00 AM',
      },
      {
        patientName: 'Tom White',
        bp: '130/85',
        pulse: '80',
        temp: '99.1',
        spo2: '97',
        timestamp: '2023-10-27 08:15 AM',
      },
    ];
  }

  showDialog() {
    this.displayAddDialog = true;
    this.newVital = {};
  }

  saveVital() {
    // Mock save
    this.vitalsList.push({
      ...this.newVital,
      timestamp: new Date().toLocaleString(),
      patientName: 'Mock Patient', // hardcoded for now
    });
    this.displayAddDialog = false;
  }
}
