import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { AppointmentResponse } from '../../../appointments/models/appointment.model';
import { AppointmentStatus } from '../../../../core/models/patient.model';

@Component({
  selector: 'app-triage-queue',
  templateUrl: './triage-queue.component.html',
  styleUrl: './triage-queue.component.scss',
})
export class TriageQueueComponent implements OnInit {
  queue: AppointmentResponse[] = [];
  loading = false;

  cols: any[] = [
    { field: 'patientName', header: 'Patient' },
    { field: 'doctorName', header: 'For Doctor' },
    { field: 'startDateTime', header: 'Time' },
    // { field: 'department', header: 'Department' }, // Department not in AppointmentResponse yet
  ];

  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.appointmentService.getAppointments().subscribe((appointments) => {
      this.queue = appointments.filter(
        // Filter for scheduled or checked-in appointments waiting for triage
        (a) =>
          a.status === AppointmentStatus.SCHEDULED ||
          a.status === AppointmentStatus.CHECKED_IN,
      );
      this.loading = false;
    });
  }

  onRecordVitals(visit: AppointmentResponse) {
    this.router.navigate(['/triage/vitals', visit.id]);
  }
}
