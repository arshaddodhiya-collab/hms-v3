import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  EncounterService,
  Encounter,
  PrescriptionItem,
} from '../../../../core/services/encounter.service';
import { LabService } from '../../../../core/services/lab.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-consultation-detail',
  templateUrl: './consultation-detail.component.html',
  styleUrls: ['./consultation-detail.component.scss'],
  providers: [MessageService],
})
export class ConsultationDetailComponent implements OnInit {
  appointmentId: string | null = null;
  patient = {
    name: 'John Doe',
    age: 30,
    gender: 'Male',
    id: 101,
    lastVisit: '2023-10-10',
  };

  currentEncounter: Encounter | null = null;
  diagnosis: string = '';
  notes: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private encounterService: EncounterService,
    // private labService: LabService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.appointmentId = this.route.snapshot.paramMap.get('appointmentId');
    if (this.appointmentId) {
      // Start or Resume Encounter
      this.encounterService
        .startEncounter(this.appointmentId, this.patient.id, 1) // Mock Doctor ID 1
        .subscribe((encounter) => {
          this.currentEncounter = encounter;
          if (encounter.diagnosis) this.diagnosis = encounter.diagnosis;
          if (encounter.notes) this.notes = encounter.notes;
        });
    }
  }

  onPrescriptionSave(items: PrescriptionItem[]) {
    if (!this.currentEncounter) return;

    this.encounterService
      .savePrescription(this.currentEncounter.id, items)
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Saved',
          detail: 'Prescription saved successfully',
        });
      });
  }

  saveDiagnosis() {
    if (!this.currentEncounter) return;

    this.encounterService
      .saveDiagnosis(this.currentEncounter.id, this.diagnosis, this.notes)
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Saved',
          detail: 'Diagnosis saved',
        });
      });
  }

  finishConsultation() {
    if (!this.currentEncounter) return;

    // save one last time
    this.saveDiagnosis();

    this.encounterService
      .endEncounter(this.currentEncounter.id)
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Completed',
          detail: 'Consultation finished',
        });
        setTimeout(() => {
          this.router.navigate(['/consultation']);
        }, 500);
      });
  }
}
