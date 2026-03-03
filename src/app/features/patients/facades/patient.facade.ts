import { Injectable, signal } from '@angular/core';
import { MessageService } from 'primeng/api';

import { BaseFacade } from '../../../core/facades/base-facade';
import { PatientService } from '../services/patient.service';
import { Patient } from '../../../core/models/patient.model';

/**
 * PatientFacade — Central state management for the Patients module.
 */
@Injectable({
  providedIn: 'root',
})
export class PatientFacade extends BaseFacade<Patient> {
  // --- Signals ---
  readonly patients = signal<Patient[]>([]);
  readonly selectedPatient = signal<Patient | null>(null);
  readonly totalRecords = signal(0);
  readonly saving = signal(false);

  constructor(
    private patientService: PatientService,
    private messageService: MessageService,
  ) {
    super();
  }

  // ==============================
  //  ACTIONS
  // ==============================

  override load(): void {
    this.loadPatients();
  }

  loadPatients(query?: string, page: number = 0, size: number = 10): void {
    this.loading.set(true);
    this.error.set(null);

    this.patientService.getPatients(query, page, size).subscribe({
      next: (response) => {
        this.patients.set(response.content);
        this.data.set(response.content);
        this.totalRecords.set(response.totalElements || 0);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load patients',
        });
      },
    });
  }

  loadPatientById(id: number): void {
    this.loading.set(true);
    this.patientService.getPatientById(id).subscribe({
      next: (data) => {
        this.selectedPatient.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Error loading patient', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load patient details',
        });
      },
    });
  }

  registerPatient(patient: any, onSuccess: () => void): void {
    this.saving.set(true);
    this.patientService.registerPatient(patient).subscribe({
      next: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Patient Registered',
        });
        onSuccess();
      },
      error: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save patient',
        });
      },
    });
  }

  updatePatient(id: number, patient: any, onSuccess: () => void): void {
    this.saving.set(true);
    this.patientService.updatePatient(id, patient).subscribe({
      next: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Patient Updated',
        });
        onSuccess();
      },
      error: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save patient',
        });
      },
    });
  }

  deletePatient(id: number): void {
    this.saving.set(true);
    this.patientService.deletePatient(id).subscribe({
      next: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Patient deleted successfully.',
        });
        this.loadPatients();
      },
      error: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete patient',
        });
      },
    });
  }
}
