import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-triage-list',
  templateUrl: './triage-list.component.html',
  styleUrls: ['./triage-list.component.scss'],
})
export class TriageListComponent implements OnInit {
  // Mock Data - in real app would come from service filtering for 'Checked In' or 'Triaged'
  triageQueue = [
    {
      id: 101,
      patientName: 'John Doe',
      doctorName: 'Dr. Smith',
      status: 'Checked In',
      time: '10:00 AM',
      priority: 'Normal',
    },
    {
      id: 102,
      patientName: 'Jane Smith',
      doctorName: 'Dr. Jones',
      status: 'Triaged',
      time: '10:15 AM',
      priority: 'High',
    },
    {
      id: 103,
      patientName: 'Bob Brown',
      doctorName: 'Dr. Smith',
      status: 'Checked In',
      time: '10:30 AM',
      priority: 'Emergency',
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
