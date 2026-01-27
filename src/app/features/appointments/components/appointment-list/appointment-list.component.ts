import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss'],
})
export class AppointmentListComponent implements OnInit {
  appointments = [
    {
      id: 101,
      patientName: 'John Doe',
      doctorName: 'Dr. Smith',
      date: '2023-10-25',
      time: '10:00 AM',
      status: 'Confirmed',
    },
    {
      id: 102,
      patientName: 'Jane Smith',
      doctorName: 'Dr. Jones',
      date: '2023-10-26',
      time: '02:00 PM',
      status: 'Pending',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  getStatusSeverity(status: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (status) {
      case 'Confirmed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Cancelled':
        return 'danger';
      default:
        return 'info';
    }
  }
}
