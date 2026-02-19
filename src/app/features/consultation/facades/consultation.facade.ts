import { Injectable, signal, computed } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

import { EncounterService } from '../services/encounter.service';
import { AppointmentService } from '../../appointments/services/appointment.service';
import { AuthService } from '../../auth/services/auth.service';
import {
  EncounterResponse,
  EncounterCreateRequest,
} from '../../../core/models/encounter.model';
import {
  PrescriptionItem,
  PrescriptionRequest,
  PrescriptionResponse,
} from '../../../core/models/prescription.model';

/**
 * ConsultationFacade — Central state management for the Consultation module.
 */
@Injectable({
  providedIn: 'root',
})
export class ConsultationFacade {
  // --- Signals ---
  readonly encounter = signal<EncounterResponse | null>(null);
  readonly doctorQueue = signal<EncounterResponse[]>([]);
  readonly prescription = signal<PrescriptionResponse | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);

  // --- Computed ---
  readonly queueCount = computed(() => this.doctorQueue().length);

  constructor(
    private encounterService: EncounterService,
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private messageService: MessageService,
  ) {}

  // ==============================
  //  ACTIONS
  // ==============================

  loadDoctorQueue(doctorId?: number): void {
    this.loading.set(true);
    const currentUser = this.authService.getCurrentUser();
    const id = doctorId || currentUser?.id;
    if (!id) return;

    this.encounterService.getOpdDoctorQueue(id).subscribe({
      next: (data) => {
        this.doctorQueue.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load OPD queue',
        });
      },
    });
  }

  loadEncounterById(id: number): void {
    this.loading.set(true);
    this.encounterService.getEncounterById(id).subscribe({
      next: (encounter) => {
        this.encounter.set(encounter);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load encounter',
        });
      },
    });
  }

  startEncounterFromAppointment(
    appointmentId: number,
    onSuccess: (encounter: EncounterResponse) => void,
    onError: (msg: string) => void,
  ): void {
    this.loading.set(true);

    this.appointmentService.getAppointmentById(appointmentId).subscribe({
      next: (appt) => {
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
          this.loading.set(false);
          onError('User not logged in');
          return;
        }

        const request: EncounterCreateRequest = {
          appointmentId: appointmentId,
          patientId: appt.patientId,
          doctorId: currentUser.id,
        };

        this.encounterService.startEncounter(request).subscribe({
          next: (encounter) => {
            this.encounter.set(encounter);
            this.loading.set(false);
            onSuccess(encounter);
          },
          error: () => {
            this.loading.set(false);
            onError('Failed to start encounter');
          },
        });
      },
      error: () => {
        this.loading.set(false);
        onError('Failed to load appointment');
      },
    });
  }

  updateClinicalNotes(
    encounterId: number,
    data: { chiefComplaint: string; diagnosis: string; notes: string },
  ): void {
    this.saving.set(true);
    this.encounterService.updateClinicalNotes(encounterId, data).subscribe({
      next: (updated) => {
        this.encounter.set(updated);
        this.saving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Saved',
          detail: 'Diagnosis saved',
        });
      },
      error: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save diagnosis',
        });
      },
    });
  }

  savePrescription(encounterId: number, items: PrescriptionItem[]): void {
    this.saving.set(true);
    const request: PrescriptionRequest = {
      items: items,
      note: 'Prescribed during consultation',
    };

    this.encounterService.savePrescription(encounterId, request).subscribe({
      next: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Saved',
          detail: 'Prescription saved successfully',
        });
      },
      error: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save prescription',
        });
      },
    });
  }

  finishConsultation(
    encounterId: number,
    clinicalData: { chiefComplaint: string; diagnosis: string; notes: string },
    onSuccess: () => void,
  ): void {
    this.saving.set(true);

    this.encounterService
      .updateClinicalNotes(encounterId, clinicalData)
      .pipe(
        switchMap((updated) => {
          this.encounter.set(updated);
          return this.encounterService.completeEncounter(updated.id);
        }),
      )
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Completed',
            detail: 'Consultation finished',
          });
          onSuccess();
        },
        error: () => {
          this.saving.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to complete consultation',
          });
        },
      });
  }
}
