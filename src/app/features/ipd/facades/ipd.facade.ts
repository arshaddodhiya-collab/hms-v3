import { Injectable, signal, computed } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';

import { BaseFacade } from '../../../core/facades/base-facade';
import { IpdService } from '../services/ipd.service';
import { PatientService } from '../../patients/services/patient.service';
import { UserService } from '../../../core/services/user.service';
import { Admission, Bed, Patient } from '../../../core/models/patient.model';

/**
 * IpdFacade — Single source of truth for all IPD-related state.
 *
 * Components inject this instead of multiple services and manage
 * NO loading/error/data state themselves.
 */
@Injectable({
  providedIn: 'root',
})
export class IpdFacade extends BaseFacade<Admission> {
  // --- Bed signals ---
  readonly beds = signal<Bed[]>([]);
  readonly admissions = signal<Admission[]>([]);

  // --- Filters ---
  readonly showAvailable = signal(true);
  readonly showOccupied = signal(true);

  // --- Admission Form Data ---
  readonly patients = signal<Patient[]>([]);
  readonly doctors = signal<any[]>([]);
  readonly wards = signal<{ label: string; value: number }[]>([]);
  readonly availableBeds = signal<Bed[]>([]);
  readonly saving = signal(false);

  // --- Computed: Bed → Admission map ---
  readonly bedAdmissionMap = computed(() => {
    const map = new Map<number, Admission>();
    this.admissions().forEach((a) => {
      if (a.bed && a.bed.id) {
        map.set(a.bed.id, a);
      }
    });
    return map;
  });

  // --- Computed: Wards grouped from beds (with filters applied) ---
  readonly filteredWards = computed(() => {
    const wardMap = new Map<string, Bed[]>();
    const showAvail = this.showAvailable();
    const showOcc = this.showOccupied();

    this.beds().forEach((bed) => {
      if (bed.isOccupied && !showOcc) return;
      if (!bed.isOccupied && !showAvail) return;

      const wardName = bed.ward?.name || 'Unknown Ward';
      if (!wardMap.has(wardName)) {
        wardMap.set(wardName, []);
      }
      wardMap.get(wardName)!.push(bed);
    });

    const result: { name: string; beds: Bed[] }[] = [];
    wardMap.forEach((beds, name) => {
      result.push({ name, beds });
    });
    return result;
  });

  // --- Computed: Stats ---
  readonly availableCount = computed(
    () => this.beds().filter((b) => !b.isOccupied).length,
  );
  readonly occupiedCount = computed(
    () => this.beds().filter((b) => b.isOccupied).length,
  );
  readonly occupancyRate = computed(() => {
    const total = this.beds().length;
    if (total === 0) return 0;
    return Math.round((this.occupiedCount() / total) * 100);
  });

  // --- Computed: Admission list with flattened ward/bed info ---
  readonly admissionList = computed(() =>
    this.admissions().map((a) => ({
      ...a,
      wardName: a.bed?.ward?.name || 'N/A',
      bedNumber: a.bed?.number || 'N/A',
    })),
  );

  constructor(
    private ipdService: IpdService,
    private patientService: PatientService,
    private userService: UserService,
    private messageService: MessageService,
  ) {
    super();
  }

  // ==============================
  //  ACTIONS
  // ==============================

  /** Load beds and admissions together (for Bed Management) */
  override load(): void {
    this.loadBedData();
  }

  loadBedData(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      beds: this.ipdService.getBeds(),
      admissions: this.ipdService.getAdmissions(),
    }).subscribe({
      next: ({ beds, admissions }) => {
        this.beds.set(beds);
        this.admissions.set(admissions);
        this.data.set(admissions);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Failed to load bed data');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load beds and admissions',
        });
      },
    });
  }

  /** Load only admissions (for Admission List) */
  loadAdmissions(): void {
    this.loading.set(true);
    this.ipdService.getAdmissions().subscribe({
      next: (data) => {
        this.admissions.set(data);
        this.data.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load admissions',
        });
      },
    });
  }

  /** Load form reference data (patients, doctors, wards) */
  loadAdmissionFormData(): void {
    this.patientService
      .getPatients()
      .subscribe((data) => this.patients.set(data.content));

    this.userService.getDoctors().subscribe((data) => this.doctors.set(data));

    this.ipdService.getBeds().subscribe((data) => {
      const uniqueWards = new Map<number, { id: number; name: string }>();
      data.forEach((b) => {
        if (b.ward) uniqueWards.set(b.ward.id, b.ward);
      });
      this.wards.set(
        Array.from(uniqueWards.values()).map((w) => ({
          label: w.name,
          value: w.id,
        })),
      );
    });
  }

  /** Load available beds for a selected ward */
  loadAvailableBeds(wardId: number): void {
    this.ipdService.getAvailableBeds(wardId).subscribe((beds) => {
      this.availableBeds.set(beds);
    });
  }

  /** Toggle filter and let computed signal auto-update */
  toggleAvailable(value: boolean): void {
    this.showAvailable.set(value);
  }

  toggleOccupied(value: boolean): void {
    this.showOccupied.set(value);
  }

  /** Get the admission for a specific bed (reactive helper) */
  getAdmissionForBed(bedId: number): Admission | undefined {
    return this.bedAdmissionMap().get(bedId);
  }

  // --- Mutations ---

  admitPatient(
    payload: {
      patientId: number;
      doctorId: number;
      bedId: number;
      diagnosis: string;
    },
    onSuccess: () => void,
  ): void {
    this.saving.set(true);
    this.ipdService.admitPatient(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Patient Admitted',
        });
        onSuccess();
      },
      error: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to admit patient',
        });
      },
    });
  }

  dischargePatient(
    admissionId: number,
    payload: any,
    onSuccess: () => void,
  ): void {
    this.saving.set(true);
    this.ipdService.dischargePatient(admissionId, payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Patient Discharged',
        });
        onSuccess();
      },
      error: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to discharge patient',
        });
      },
    });
  }

  addRound(payload: any, onSuccess: () => void): void {
    this.saving.set(true);
    this.ipdService.addRound(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Round added successfully.',
        });
        onSuccess();
      },
      error: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add round.',
        });
      },
    });
  }
}
