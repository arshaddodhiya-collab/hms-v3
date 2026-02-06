import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { IpdService } from '../../services/ipd.service';
import { PatientService } from '../../../patients/services/patient.service';
import {
  Admission,
  Bed,
  AdmissionStatus,
  Patient,
} from '../../../../core/models/patient.model';

@Component({
  selector: 'app-admission-form',
  templateUrl: './admission-form.component.html',
  styleUrl: './admission-form.component.scss',
})
export class AdmissionFormComponent implements OnInit {
  admission: Partial<Admission> = {
    status: AdmissionStatus.ADMITTED,
    doctorName: '',
    diagnosis: '',
  };

  patients: Patient[] = [];
  beds: Bed[] = [];
  availableBeds: Bed[] = [];
  wards: any[] = [];

  selectedPatient: Patient | null = null;
  selectedWard: string | null = null;
  selectedBed: Bed | null = null;

  loading = false;
  submitted = false;

  constructor(
    private ipdService: IpdService,
    private patientService: PatientService,
    private messageService: MessageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadPatients();
    this.loadBeds();
  }

  loadPatients() {
    this.patientService
      .getPatients()
      .subscribe((data) => (this.patients = data));
  }

  loadBeds() {
    this.ipdService.getBeds().subscribe((data) => {
      this.beds = data;
      const uniqueWards = [...new Set(data.map((b) => b.ward))];
      this.wards = uniqueWards.map((w) => ({ label: w, value: w }));
    });
  }

  onWardChange() {
    if (this.selectedWard) {
      this.availableBeds = this.beds.filter(
        (b) => b.ward === this.selectedWard && !b.isOccupied,
      );
      this.selectedBed = null;
    }
  }

  save() {
    this.submitted = true;
    if (this.selectedPatient && this.selectedBed && this.admission.doctorName) {
      this.loading = true;

      const newAdmission: Admission = {
        ...this.admission,
        patientId: this.selectedPatient.id,
        patientName: this.selectedPatient.name,
        ward: this.selectedBed.ward,
        bedNumber: this.selectedBed.number,
      } as Admission;

      this.ipdService.admitPatient(newAdmission).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Patient Admitted',
          });
          this.router.navigate(['/ipd/admissions']);
        },
        error: () => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to admitted',
          });
        },
      });
    }
  }

  cancel() {
    this.router.navigate(['/ipd/admissions']);
  }
}
