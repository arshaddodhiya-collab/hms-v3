import { Injectable, signal, computed } from '@angular/core';
import { MessageService } from 'primeng/api';

import { BaseFacade } from '../../../core/facades/base-facade';
import { AppointmentService } from '../services/appointment.service';
import {
  AppointmentRequest,
  AppointmentResponse,
} from '../models/appointment.model';

/**
 * AppointmentFacade — Central state management for the Appointments module.
 */
@Injectable({
  providedIn: 'root',
})
export class AppointmentFacade extends BaseFacade<AppointmentResponse> {
  // --- Signals ---
  readonly appointments = signal<AppointmentResponse[]>([]);
  readonly selectedAppointment = signal<AppointmentResponse | null>(null);
  readonly saving = signal(false);

  // --- Computed ---
  readonly todaysAppointments = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return this.appointments().filter(
      (a) => a.startDateTime && a.startDateTime.startsWith(today),
    );
  });

  constructor(
    private appointmentService: AppointmentService,
    private messageService: MessageService,
  ) {
    super();
  }

  // ==============================
  //  ACTIONS
  // ==============================

  override load(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading.set(true);
    this.error.set(null);

    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        this.appointments.set(data);
        this.data.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load appointments',
        });
      },
    });
  }

  loadById(id: number): void {
    this.loading.set(true);
    this.appointmentService.getAppointmentById(id).subscribe({
      next: (data) => {
        this.selectedAppointment.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load appointment details',
        });
      },
    });
  }

  checkIn(id: number): void {
    this.saving.set(true);
    this.appointmentService.checkInAppointment(id).subscribe({
      next: (updated) => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Checked In',
          detail: `Patient ${updated.patientName} checked in.`,
        });
        this.loadAll();
      },
      error: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to check in appointment',
        });
      },
    });
  }

  cancel(id: number, reason: string): void {
    this.saving.set(true);
    this.appointmentService.cancelAppointment(id, reason).subscribe({
      next: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Cancelled',
          detail: 'Appointment cancelled.',
        });
        this.loadAll();
      },
      error: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to cancel appointment',
        });
      },
    });
  }

  startConsultation(id: number): void {
    this.saving.set(true);
    this.appointmentService.startConsultation(id).subscribe({
      next: () => {
        this.saving.set(false);
        this.loadAll();
      },
      error: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to start consultation',
        });
      },
    });
  }

  complete(id: number): void {
    this.saving.set(true);
    this.appointmentService.completeAppointment(id).subscribe({
      next: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Completed',
          detail: 'Appointment completed.',
        });
        this.loadAll();
      },
      error: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to complete appointment',
        });
      },
    });
  }

  markNoShow(id: number): void {
    this.saving.set(true);
    this.appointmentService.markNoShow(id).subscribe({
      next: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'info',
          summary: 'No Show',
          detail: 'Appointment marked as no-show.',
        });
        this.loadAll();
      },
      error: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to mark no show',
        });
      },
    });
  }

  restore(id: number): void {
    this.saving.set(true);
    this.appointmentService.restoreAppointment(id).subscribe({
      next: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Restored',
          detail: 'Appointment restored.',
        });
        this.loadAll();
      },
      error: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to restore appointment',
        });
      },
    });
  }

  createAppointment(
    appointment: AppointmentRequest,
    onSuccess: () => void,
  ): void {
    this.saving.set(true);
    this.appointmentService.createAppointment(appointment).subscribe({
      next: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Created',
          detail: 'Appointment created successfully.',
        });
        onSuccess();
      },
      error: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create appointment',
        });
      },
    });
  }

  updateAppointment(
    id: number,
    appointment: AppointmentRequest,
    onSuccess: () => void,
  ): void {
    this.saving.set(true);
    this.appointmentService.updateAppointment(id, appointment).subscribe({
      next: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Appointment updated successfully.',
        });
        onSuccess();
      },
      error: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update appointment',
        });
      },
    });
  }
}
