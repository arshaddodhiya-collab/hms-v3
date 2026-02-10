import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../../../core/models/patient.model';

@Component({
  selector: 'app-patient-edit',
  templateUrl: './patient-edit.component.html',
  styleUrls: ['./patient-edit.component.scss'],
})
export class PatientEditComponent implements OnInit {
  patientId: number | null = null;
  patient: Patient | null = null;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.patientId = +id;
      this.loadPatient(this.patientId);
    }
  }

  loadPatient(id: number) {
    this.patientService.getPatientById(id).subscribe({
      next: (data) => {
        this.patient = data;
      },
      error: (err: any) => {
        console.error('Error loading patient', err);
      },
    });
  }
}
