import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-consultation-list',
  templateUrl: './consultation-list.component.html',
  styleUrls: ['./consultation-list.component.scss'],
})
export class ConsultationListComponent implements OnInit {
  // Mock Data - representing patients who have completed Triage
  consultationQueue = [
    {
      id: 101,
      patientName: 'John Doe',
      age: 30,
      gender: 'Male',
      priority: 'Normal',
      waitTime: '15 mins',
      status: 'Waiting',
    },
    {
      id: 102,
      patientName: 'Jane Smith',
      age: 25,
      gender: 'Female',
      priority: 'High',
      waitTime: '30 mins',
      status: 'Waiting',
    },
    {
      id: 103,
      patientName: 'Bob Brown',
      age: 45,
      gender: 'Male',
      priority: 'Emergency',
      waitTime: '5 mins',
      status: 'Waiting',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  getPrioritySeverity(
    priority: string,
  ): 'success' | 'info' | 'warning' | 'danger' | undefined {
    switch (priority) {
      case 'Normal':
        return 'info';
      case 'High':
        return 'warning';
      case 'Emergency':
        return 'danger';
      default:
        return 'info';
    }
  }
}
