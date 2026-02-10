import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { Patient, MedicalHistory } from '../../../../core/models/patient.model';

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

  // Placeholder for Appointments
  appointments: any[] = [];

  // Placeholder for Prescriptions
  prescriptions: any[] = [];

  // Medical History from Patient Details
  medicalHistory: MedicalHistory[] = [];

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.patientId = +id;
      this.loadPatientDetails(this.patientId);
    }
  }

  loadPatientDetails(id: number): void {
    this.loading = true;
    this.patientService.getPatientById(id).subscribe({
      next: (data) => {
        this.patient = data;
        this.medicalHistory = data.medicalHistory || [];
        this.loading = false;
        // Trigger other data loads if services exist (e.g. appointmentService.getByPatientId(id))
      },
      error: (err) => {
        console.error('Error loading patient details', err);
        this.loading = false;
      },
    });
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
        return 'success';
      case 'Scheduled':
      case 'CHRONIC':
        return 'info';
      case 'Cancelled':
        return 'danger';
      case 'Ongoing':
      case 'ONGOING':
        return 'warning';
      default:
        return 'info';
    }
  }
}
