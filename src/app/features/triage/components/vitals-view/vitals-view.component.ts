import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TriageService } from '../../services/triage.service';
import { EncounterService } from '../../../consultation/services/encounter.service';
import { VitalsResponse } from '../../../../core/models/vitals.model';

@Component({
  selector: 'app-vitals-view',
  templateUrl: './vitals-view.component.html',
  styleUrls: ['./vitals-view.component.scss'],
})
export class VitalsViewComponent implements OnInit {
  @Input() appointmentId: string | number | null = null;
  @Input() encounterId: number | null = null;
  vitals: VitalsResponse | null = null;

  constructor(
    private route: ActivatedRoute,
    private triageService: TriageService,
    private encounterService: EncounterService,
  ) {}

  ngOnInit(): void {
    // Priority: Input encounterId > Input appointmentId > Route appointmentId
    if (this.encounterId) {
      this.loadVitals(this.encounterId);
      return;
    }

    if (!this.appointmentId) {
      this.appointmentId = this.route.snapshot.paramMap.get('appointmentId');
    }

    if (this.appointmentId) {
      this.encounterService
        .getEncounterByAppointmentId(+this.appointmentId)
        .subscribe({
          next: (encounter) => {
            this.loadVitals(encounter.id);
          },
          error: () => {
            // No encounter yet or error
            console.log('No encounter found for this appointment');
          },
        });
    }
  }

  loadVitals(encounterId: number) {
    this.triageService.getVitals(encounterId).subscribe({
      next: (data) => {
        this.vitals = data;
      },
      error: (err) => console.error(err),
    });
  }

  isEmergency(type: string, value: any): boolean {
    if (!value) return false;
    if (type === 'systolic' && value > 140) return true;
    if (type === 'diastolic' && value > 90) return true;
    if (type === 'temp' && value > 38) return true;
    if (type === 'spo2' && value < 90) return true;
    return false;
  }
}
