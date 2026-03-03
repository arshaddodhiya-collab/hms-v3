import { Component, OnInit, effect } from '@angular/core';
import { Router } from '@angular/router';
import { TriageFacade } from '../../facades/triage.facade';
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
    private triageFacade: TriageFacade,
    private router: Router,
  ) {
    effect(() => {
      this.queue = this.triageFacade.queue();
    });
    effect(() => {
      this.loading = this.triageFacade.loading();
    });
  }

  ngOnInit(): void {
    this.triageFacade.loadQueue();
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
