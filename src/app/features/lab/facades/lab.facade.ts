import { Injectable, signal, computed } from '@angular/core';
import { MessageService } from 'primeng/api';

import { BaseFacade } from '../../../core/facades/base-facade';
import { LabService } from '../services/lab.service';
import {
  LabRequest,
  LabTest,
  CreateLabRequest,
  LabRequestStatus,
  AddLabResultRequest,
} from '../../../core/models/lab.models';

/**
 * LabFacade — Central state management for the Lab module.
 */
@Injectable({
  providedIn: 'root',
})
export class LabFacade extends BaseFacade<LabRequest> {
  // --- Signals ---
  readonly labQueue = signal<LabRequest[]>([]);
  readonly labTests = signal<LabTest[]>([]);
  readonly selectedRequest = signal<LabRequest | null>(null);
  readonly saving = signal(false);

  // --- Computed ---
  readonly pendingCount = computed(
    () =>
      this.labQueue().filter(
        (r) =>
          r.status === LabRequestStatus.ORDERED ||
          r.status === LabRequestStatus.SAMPLED,
      ).length,
  );

  constructor(
    private labService: LabService,
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

  loadQueue(status?: LabRequestStatus[], encounterId?: number): void {
    this.loading.set(true);
    this.labService.getLabQueue(status, encounterId).subscribe({
      next: (data) => {
        this.labQueue.set(data);
        this.data.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load lab queue',
        });
      },
    });
  }

  loadLabTests(): void {
    this.labService.getAllLabTests().subscribe({
      next: (data) => this.labTests.set(data),
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load lab tests',
        });
      },
    });
  }

  loadRequestById(id: number): void {
    this.loading.set(true);
    this.labService.getLabRequestById(id).subscribe({
      next: (data) => {
        this.selectedRequest.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load lab request',
        });
      },
    });
  }

  createRequest(request: CreateLabRequest, onSuccess: () => void): void {
    this.saving.set(true);
    this.labService.createLabRequest(request).subscribe({
      next: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Created',
          detail: 'Lab request created.',
        });
        onSuccess();
      },
      error: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create lab request',
        });
      },
    });
  }

  updateStatus(id: number, status: LabRequestStatus): void {
    this.saving.set(true);
    this.labService.updateStatus(id, status).subscribe({
      next: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: `Status updated to ${status}.`,
        });
        this.loadQueue();
      },
      error: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update status',
        });
      },
    });
  }

  addResults(
    id: number,
    results: AddLabResultRequest[],
    onSuccess: () => void,
  ): void {
    this.saving.set(true);
    this.labService.addResults(id, results).subscribe({
      next: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Saved',
          detail: 'Lab results recorded.',
        });
        onSuccess();
      },
      error: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save lab results',
        });
      },
    });
  }
}
