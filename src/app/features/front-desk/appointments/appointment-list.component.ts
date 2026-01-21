import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss'],
})
export class AppointmentListComponent implements OnInit {
  appointments: any[] = [];

  constructor() {}

  ngOnInit() {
    // Mock Data
    this.appointments = [
      {
        id: '1001',
        patientName: 'John Doe',
        doctorName: 'Dr. Smith',
        specialization: 'Cardiology',
        time: '10:00 AM',
        status: 'Confirmed',
      },
      {
        id: '1002',
        patientName: 'Jane Smith',
        doctorName: 'Dr. Emily Stone',
        specialization: 'Neurology',
        time: '11:30 AM',
        status: 'Pending',
      },
      {
        id: '1003',
        patientName: 'Robert Brown',
        doctorName: 'Dr. Smith',
        specialization: 'Cardiology',
        time: '02:00 PM',
        status: 'Cancelled',
      },
    ];
  }

  getSeverity(status: string) {
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
