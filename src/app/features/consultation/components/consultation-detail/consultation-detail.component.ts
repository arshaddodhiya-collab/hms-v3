import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { EncounterService } from '../../services/encounter.service';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { AuthService } from '../../../auth/services/auth.service';
import {
  EncounterResponse,
  EncounterCreateRequest,
} from '../../../../core/models/encounter.model';
import {
  PrescriptionItem,
  PrescriptionRequest,
} from '../../../../core/models/prescription.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-consultation-detail',
  templateUrl: './consultation-detail.component.html',
  styleUrls: ['./consultation-detail.component.scss'],
  providers: [MessageService],
})
export class ConsultationDetailComponent implements OnInit {
  appointmentId: number | null = null;
  currentEncounter: EncounterResponse | null = null;
  patientName: string = '';

  diagnosis: string = '';
  notes: string = '';
  chiefComplaint: string = ''; // Added field

  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private encounterService: EncounterService,
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('appointmentId');
    if (idParam) {
      this.appointmentId = +idParam;
      this.initConsultation();
    } else {
      this.errorAndRedirect('Invalid Appointment ID');
    }
  }

  initConsultation() {
    this.loading = true;
    if (!this.appointmentId) return;

    // 1. Get Appointment Details
    this.appointmentService.getAppointmentById(this.appointmentId).subscribe({
      next: (appt) => {
        this.patientName = appt.patientName;
        // 2. Start/Resume Encounter
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
          this.errorAndRedirect('User not logged in');
          return;
        }

        const request: EncounterCreateRequest = {
          appointmentId: this.appointmentId!,
          patientId: appt.patientId,
          doctorId: currentUser.id,
        };

        this.encounterService.startEncounter(request).subscribe({
          next: (encounter) => {
            this.currentEncounter = encounter;
            this.diagnosis = encounter.diagnosis || '';
            this.notes = encounter.notes || '';
            this.chiefComplaint = encounter.chiefComplaint || '';
            this.loading = false;
          },
          error: (err) => this.errorAndRedirect('Failed to start encounter'),
        });
      },
      error: (err) => this.errorAndRedirect('Failed to load appointment'),
    });
  }

  onPrescriptionSave(items: PrescriptionItem[]) {
    if (!this.currentEncounter) return;

    const request: PrescriptionRequest = {
      items: items,
      note: 'Prescribed during consultation', // Optional note
    };

    this.encounterService
      .savePrescription(this.currentEncounter.id, request)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Saved',
            detail: 'Prescription saved successfully',
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to save prescription',
          });
        },
      });
  }

  saveDiagnosis() {
    if (!this.currentEncounter) return;

    this.encounterService
      .updateClinicalNotes(this.currentEncounter.id, {
        chiefComplaint: this.chiefComplaint,
        diagnosis: this.diagnosis,
        notes: this.notes,
      })
      .subscribe({
        next: (updated) => {
          this.currentEncounter = updated; // Update state
          this.messageService.add({
            severity: 'success',
            summary: 'Saved',
            detail: 'Diagnosis saved',
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to save diagnosis',
          });
        },
      });
  }

  finishConsultation() {
    if (!this.currentEncounter) return;

    this.loading = true;

    // Chain: Save Notes -> Complete Encounter
    this.encounterService
      .updateClinicalNotes(this.currentEncounter.id, {
        chiefComplaint: this.chiefComplaint,
        diagnosis: this.diagnosis,
        notes: this.notes,
      })
      .pipe(
        switchMap((updated) => {
          this.currentEncounter = updated;
          return this.encounterService.completeEncounter(
            this.currentEncounter.id,
          );
        }),
      )
      .subscribe({
        next: () => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Completed',
            detail: 'Consultation finished',
          });
          setTimeout(() => {
            this.router.navigate(['/consultation']);
          }, 500);
        },
        error: (err) => {
          this.loading = false;
          console.error('Failed to finish consultation', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to complete consultation',
          });
        },
      });
  }

  errorAndRedirect(msg: string) {
    console.error(msg);
    this.loading = false;
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: msg,
    });
    setTimeout(() => this.router.navigate(['/consultation']), 1000);
  }

  viewLabRequests() {
    if (!this.currentEncounter) return;
    this.router.navigate(['/lab'], {
      queryParams: { encounterId: this.currentEncounter.id },
    });
  }
}
