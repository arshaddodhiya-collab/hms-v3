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

  displayDialog: boolean = false;
  appointment: any = {};
  submitted: boolean = false;
  statuses: any[] = [
    { label: 'Confirmed', value: 'Confirmed' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  constructor() {}

  ngOnInit(): void {}

  openNew() {
    this.appointment = {};
    this.submitted = false;
    this.displayDialog = true;
  }

  editAppointment(appointment: any) {
    this.appointment = { ...appointment };
    this.displayDialog = true;
  }

  hideDialog() {
    this.displayDialog = false;
    this.submitted = false;
  }

  saveAppointment() {
    this.submitted = true;

    if (this.appointment.patientName?.trim()) {
      if (this.appointment.id) {
        // Update
        const index = this.appointments.findIndex(
          (x) => x.id === this.appointment.id,
        );
        this.appointments[index] = this.appointment;
      } else {
        // Create
        this.appointment.id = Math.floor(Math.random() * 1000);
        this.appointment.status = this.appointment.status || 'Pending';
        this.appointments.push(this.appointment);
      }

      this.appointments = [...this.appointments];
      this.displayDialog = false;
      this.appointment = {};
    }
  }

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
