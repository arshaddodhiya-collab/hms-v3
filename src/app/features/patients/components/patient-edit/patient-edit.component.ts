import { Component, OnInit, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientFacade } from '../../facades/patient.facade';
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
    private patientFacade: PatientFacade,
  ) {
    effect(() => {
      this.patient = this.patientFacade.selectedPatient();
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.patientId = +id;
      this.patientFacade.loadPatientById(this.patientId);
    }
  }
}
