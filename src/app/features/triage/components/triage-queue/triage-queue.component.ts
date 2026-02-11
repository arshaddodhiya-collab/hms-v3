import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { AppointmentResponse } from '../../../appointments/models/appointment.model';
import { VisitStatus } from '../../../../core/models/patient.model';

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
        // Filter for checked-in appointments waiting for triage
        // Assuming backend uses 'CHECKED_IN' or similar status.
        // VisitStatus.TRIAGE_PENDING might effectively mean 'CHECKED_IN' in our new flow.
        (a) =>
          a.status === 'CHECKED_IN' ||
          a.status === VisitStatus.TRIAGE_PENDING ||
          a.status === 'TRIAGE_PENDING',
      );
      this.loading = false;
    });
  }

  onRecordVitals(visit: AppointmentResponse) {
    this.router.navigate(['/triage/vitals', visit.id]);
  }
}
