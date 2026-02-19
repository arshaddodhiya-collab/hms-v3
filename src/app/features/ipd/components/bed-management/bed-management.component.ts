import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Bed, Admission } from '../../../../core/models/patient.model';
import { IpdFacade } from '../../facades/ipd.facade';

@Component({
  selector: 'app-bed-management',
  templateUrl: './bed-management.component.html',
  styleUrl: './bed-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BedManagementComponent implements OnInit {
  // Round Form UI state (template-only concern)
  showRoundForm = false;
  selectedAdmissionId: number | null = null;
  selectedPatientName = '';

  constructor(public facade: IpdFacade) {}

  ngOnInit(): void {
    this.facade.loadBedData();
  }

  openRoundForm(bed: Bed) {
    const admission = this.facade.getAdmissionForBed(bed.id);
    if (!admission && bed.isOccupied) {
      console.warn('Occupied bed with no linked admission:', bed);
      return;
    }
    if (admission) {
      this.selectedAdmissionId = admission.id;
      this.selectedPatientName = admission.patientName;
      this.showRoundForm = true;
    }
  }

  onRoundSaved() {
    this.facade.loadBedData();
  }
}
