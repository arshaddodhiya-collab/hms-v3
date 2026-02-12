import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TriageService } from '../../services/triage.service';
import { EncounterResponse } from '../../../../core/models/encounter.model';

@Component({
  selector: 'app-triage-queue',
  templateUrl: './triage-queue.component.html',
  styleUrl: './triage-queue.component.scss',
})
export class TriageQueueComponent implements OnInit {
  queue: EncounterResponse[] = [];
  loading = false;

  cols: any[] = [
    { field: 'patientName', header: 'Patient' },
    { field: 'doctorName', header: 'For Doctor' },
    { field: 'startedAt', header: 'Time' },
  ];

  constructor(
    private triageService: TriageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.triageService.getTriageQueue().subscribe({
      next: (encounters) => {
        this.queue = encounters;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load triage queue', err);
        this.loading = false;
      },
    });
  }

  onRecordVitals(visit: EncounterResponse) {
    // Navigate with Encounter ID
    this.router.navigate(['/triage/vitals', visit.appointmentId]);
    // Wait, VitalsEntry expects AppointmentId currently.
    // If I change it to use EncounterId, I need to update routing too.
    // The plan says VitalsEntryComponent gets Encounter by AppointmentId.
    // Let's stick to AppointmentId for routing to match existing flow,
    // OR better, switch to EncounterId if possible.
    // TriageService.saveVitals takes EncounterId.
    // So VitalsEntryComponent needs EncounterId.
    // If I pass AppointmentId, I have to resolve EncounterId again.
    // But I already have EncounterId here (visit.id).
    // Let's pass EncounterId and update VitalsEntryComponent to use it.

    // Changing to pass Encounter ID.
    this.router.navigate(['/triage/vitals', visit.id]);
  }
}
