import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { IpdService } from '../../services/ipd.service';
import { PatientService } from '../../../patients/services/patient.service';
import { UserService } from '../../../../core/services/user.service';
import { Bed, Patient } from '../../../../core/models/patient.model';

@Component({
  selector: 'app-admission-form',
  templateUrl: './admission-form.component.html',
  styleUrl: './admission-form.component.scss',
})
export class AdmissionFormComponent implements OnInit {
  diagnosis = '';

  patients: Patient[] = [];
  doctors: any[] = [];
  wards: any[] = [];
  availableBeds: Bed[] = [];

  selectedPatient: Patient | null = null;
  selectedDoctor: any | null = null;
  selectedWard: any | null = null;
  selectedBed: Bed | null = null;

  loading = false;
  submitted = false;

  constructor(
    private ipdService: IpdService,
    private patientService: PatientService,
    private userService: UserService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadPatients();
    this.loadDoctors();
    this.loadWards();
  }

  loadPatients() {
    this.patientService
      .getPatients()
      .subscribe((data) => (this.patients = data.content));
  }

  loadDoctors() {
    this.userService.getDoctors().subscribe((data) => (this.doctors = data));
  }

  loadWards() {
    // For now, derive wards from all beds or hardcode,
    // ideally should have a getWards API.
    // Let's use getBeds to get all unique wards for now or just fetch available beds logic
    // Backend API for 'getAvailableBeds' requires wardId.
    // We need a way to list wards first.
    // Assuming we can get all beds to extract wards, OR better:
    // Let's assume we have a fixed list or fetch from backend if API exists.
    // The backend `WardController` exists?
    // Let's rely on `ipdService.getBeds()` to extract wards for currently available view.
    this.ipdService.getBeds().subscribe((data) => {
      const uniqueWards = new Map();
      data.forEach((b) => {
        if (b.ward) uniqueWards.set(b.ward.id, b.ward);
      });
      this.wards = Array.from(uniqueWards.values()).map((w) => ({
        label: w.name,
        value: w.id,
      }));
    });
  }

  onWardChange() {
    if (this.selectedWard) {
      this.ipdService.getAvailableBeds(this.selectedWard).subscribe((beds) => {
        this.availableBeds = beds;
        this.selectedBed = null;
      });
    }
  }

  save() {
    this.submitted = true;
    if (
      this.selectedPatient &&
      this.selectedBed &&
      this.selectedDoctor &&
      this.diagnosis
    ) {
      this.loading = true;

      const payload = {
        patientId: this.selectedPatient.id,
        doctorId: this.selectedDoctor.id,
        bedId: this.selectedBed.id,
        diagnosis: this.diagnosis,
      };

      this.ipdService.admitPatient(payload).subscribe({
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
            detail: 'Failed to admit patient',
          });
        },
      });
    }
  }

  cancel() {
    this.router.navigate(['/ipd/admissions']);
  }
}
