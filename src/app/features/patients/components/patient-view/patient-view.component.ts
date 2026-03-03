import { Component, OnInit, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientFacade } from '../../facades/patient.facade';
import { EncounterService } from '../../../consultation/services/encounter.service';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { Patient, MedicalHistory } from '../../../../core/models/patient.model';
import { EncounterResponse } from '../../../../core/models/encounter.model';
import { AppointmentResponse } from '../../../appointments/models/appointment.model';

@Component({
  selector: 'app-patient-view',
  templateUrl: './patient-view.component.html',
  styleUrls: ['./patient-view.component.scss'],
})
export class PatientViewComponent implements OnInit {
  patientId: number | null = null;
  patient: Patient | null = null;
  loading = true;

  // Placeholder for Vitals (to be implemented with Vitals Service)
  activeVitals = {
    temperature: '--',
    bp: '--',
    pulse: '--',
    weight: '--',
    height: '--',
    spo2: '--',
  };

  // Appointments
  appointments: AppointmentResponse[] = [];

  // Encounters with prescriptions
  encounters: EncounterResponse[] = [];

  // Medical History from Patient Details
  medicalHistory: MedicalHistory[] = [];

  constructor(
    private route: ActivatedRoute,
    private patientFacade: PatientFacade,
    private encounterService: EncounterService,
    private appointmentService: AppointmentService,
  ) {
    effect(() => {
      const patient = this.patientFacade.selectedPatient();
      if (patient) {
        this.patient = patient;
        this.medicalHistory = patient.medicalHistory || [];
        this.loading = false;
        // Load encounter history and appointments
        if (this.patientId) {
          this.loadEncounters(this.patientId);
          this.loadAppointments(this.patientId);
        }
      }
    });
    effect(() => {
      this.loading = this.patientFacade.loading();
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.patientId = +id;
      this.loadPatientDetails(this.patientId);
    }
  }

  loadPatientDetails(id: number): void {
    this.patientFacade.loadPatientById(id);
  }

  loadEncounters(patientId: number): void {
    this.encounterService.getPatientEncounters(patientId).subscribe({
      next: (encounters) => {
        encounters.forEach((e) => {
          if (e.rounds) {
            e.rounds.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            );
          }
          if (e.vitalsHistory) {
            e.vitalsHistory.sort(
              (a, b) =>
                new Date(b.recordedAt).getTime() -
                new Date(a.recordedAt).getTime(),
            );
          }
        });
        this.encounters = encounters;
        // Extract latest vitals from most recent completed encounter
        this.extractLatestVitals(encounters);
      },
      error: (err) => {
        console.error('Error loading patient encounters', err);
      },
    });
  }

  loadAppointments(patientId: number): void {
    this.appointmentService.getPatientAppointments(patientId).subscribe({
      next: (appointments) => {
        this.appointments = appointments;
      },
      error: (err) => {
        console.error('Error loading patient appointments', err);
      },
    });
  }

  extractLatestVitals(encounters: EncounterResponse[]): void {
    // Find the most recent encounter with vitals
    const encountersWithVitals = encounters.filter((e) => e.vitals);

    if (encountersWithVitals.length > 0) {
      // Sort by startedAt descending (newest first)
      const latest = encountersWithVitals.sort(
        (a, b) =>
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
      )[0];

      if (latest.vitals) {
        this.activeVitals = {
          temperature: latest.vitals.temperature
            ? `${latest.vitals.temperature}°C`
            : '--',
          bp:
            latest.vitals.systolic && latest.vitals.diastolic
              ? `${latest.vitals.systolic}/${latest.vitals.diastolic}`
              : '--',
          pulse: latest.vitals.pulse ? `${latest.vitals.pulse} bpm` : '--',
          weight: latest.vitals.weight ? `${latest.vitals.weight} kg` : '--',
          height: latest.vitals.height ? `${latest.vitals.height} cm` : '--',
          spo2: latest.vitals.spo2 ? `${latest.vitals.spo2}%` : '--',
        };
      }
    }
  }

  getSeverity(
    status: string,
  ):
    | 'success'
    | 'secondary'
    | 'info'
    | 'warning'
    | 'danger'
    | 'contrast'
    | undefined {
    switch (status) {
      case 'Completed':
      case 'HEALED':
      case 'COMPLETED':
        return 'success';
      case 'Scheduled':
      case 'CHRONIC':
      case 'CHECKED_IN':
        return 'info';
      case 'Cancelled':
      case 'CANCELLED':
      case 'NO_SHOW':
        return 'danger';
      case 'Ongoing':
      case 'ONGOING':
      case 'IN_PROGRESS':
        return 'warning';
      default:
        return 'info';
    }
  }
}
