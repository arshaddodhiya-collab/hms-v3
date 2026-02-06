import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { Visit, VisitStatus } from '../../../../core/models/patient.model';

@Component({
  selector: 'app-triage-queue',
  templateUrl: './triage-queue.component.html',
  styleUrl: './triage-queue.component.scss',
})
export class TriageQueueComponent implements OnInit {
  queue: Visit[] = [];
  loading = false;

  cols: any[] = [
    { field: 'patientName', header: 'Patient' },
    { field: 'doctorName', header: 'For Doctor' },
    { field: 'appointmentTime', header: 'Time' },
    { field: 'department', header: 'Department' },
  ];

  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.appointmentService.appointments$.subscribe((appointments) => {
      this.queue = appointments.filter(
        (a) => a.status === VisitStatus.TRIAGE_PENDING,
      );
      this.loading = false;
    });
  }

  onRecordVitals(visit: Visit) {
    this.router.navigate(['/triage/vitals', visit.id]);
  }
}
