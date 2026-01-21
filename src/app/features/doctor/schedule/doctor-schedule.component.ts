import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-doctor-schedule',
  templateUrl: './doctor-schedule.component.html',
})
export class DoctorScheduleComponent implements OnInit {
  appointments: any[] = [];

  constructor() {}

  ngOnInit() {
    this.appointments = [
      {
        id: '101',
        patientName: 'Alice Johnson',
        age: 32,
        gender: 'Female',
        time: '10:00 AM',
        status: 'Waiting',
        type: 'Checkup',
      },
      {
        id: '102',
        patientName: 'Michael Chen',
        age: 45,
        gender: 'Male',
        time: '10:30 AM',
        status: 'Waiting',
        type: 'Follow-up',
      },
      {
        id: '103',
        patientName: 'Sarah Connor',
        age: 28,
        gender: 'Female',
        time: '11:00 AM',
        status: 'Completed',
        type: 'Checkup',
      },
    ];
  }

  getSeverity(status: string) {
    switch (status) {
      case 'Waiting':
        return 'warning';
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'danger';
      default:
        return 'info';
    }
  }
}
