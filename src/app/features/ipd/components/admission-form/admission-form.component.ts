import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Patient, Bed } from '../../../../core/models/patient.model';
import { IpdFacade } from '../../facades/ipd.facade';

@Component({
  selector: 'app-admission-form',
  templateUrl: './admission-form.component.html',
  styleUrl: './admission-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdmissionFormComponent implements OnInit {
  // Form-local state (template concerns only)
  diagnosis = '';
  selectedPatient: Patient | null = null;
  selectedDoctor: any | null = null;
  selectedWard: any | null = null;
  selectedBed: Bed | null = null;
  submitted = false;

  constructor(
    public facade: IpdFacade,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.facade.loadAdmissionFormData();
  }

  onWardChange() {
    if (this.selectedWard) {
      this.facade.loadAvailableBeds(this.selectedWard);
      this.selectedBed = null;
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
      const payload = {
        patientId: this.selectedPatient.id,
        doctorId: this.selectedDoctor.id,
        bedId: this.selectedBed.id,
        diagnosis: this.diagnosis,
      };

      this.facade.admitPatient(payload, () => {
        this.router.navigate(['/ipd/admissions']);
      });
    }
  }

  cancel() {
    this.router.navigate(['/ipd/admissions']);
  }
}
