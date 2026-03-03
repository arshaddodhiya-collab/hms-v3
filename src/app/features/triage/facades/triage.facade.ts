import { Injectable, signal } from '@angular/core';
import { MessageService } from 'primeng/api';

import { BaseFacade } from '../../../core/facades/base-facade';
import { TriageService } from '../services/triage.service';
import { EncounterResponse } from '../../../core/models/encounter.model';
import {
  VitalsRequest,
  VitalsResponse,
} from '../../../core/models/vitals.model';

/**
 * TriageFacade — Central state management for the Triage module.
 */
@Injectable({
  providedIn: 'root',
})
export class TriageFacade extends BaseFacade<EncounterResponse> {
  // --- Signals ---
  readonly queue = signal<EncounterResponse[]>([]);
  readonly selectedEncounter = signal<EncounterResponse | null>(null);
  readonly vitals = signal<VitalsResponse | null>(null);
  readonly saving = signal(false);

  constructor(
    private triageService: TriageService,
    private messageService: MessageService,
  ) {
    super();
  }

  // ==============================
  //  ACTIONS
  // ==============================

  override load(): void {
    this.loadQueue();
  }

  loadQueue(): void {
    this.loading.set(true);
    this.error.set(null);

    this.triageService.getTriageQueue().subscribe({
      next: (data) => {
        this.queue.set(data);
        this.data.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Failed to load triage queue', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load triage queue',
        });
      },
    });
  }

  loadEncounterByAppointmentId(appointmentId: number): void {
    this.loading.set(true);
    this.triageService.getEncounterByAppointmentId(appointmentId).subscribe({
      next: (data) => {
        this.selectedEncounter.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load encounter details',
        });
      },
    });
  }

  saveVitals(
    encounterId: number,
    vitals: VitalsRequest,
    onSuccess: () => void,
  ): void {
    this.saving.set(true);
    this.triageService.saveVitals(encounterId, vitals).subscribe({
      next: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Vitals Recorded',
        });
        onSuccess();
      },
      error: (err) => {
        this.saving.set(false);
        console.error('Failed to save vitals', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save vitals',
        });
      },
    });
  }

  loadVitals(encounterId: number): void {
    this.triageService.getVitals(encounterId).subscribe({
      next: (data) => {
        this.vitals.set(data);
      },
      error: (err) => {
        console.error('Failed to load vitals', err);
      },
    });
  }
}
