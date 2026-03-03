import { Component, Input, OnInit, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TriageFacade } from '../../facades/triage.facade';
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
  @Input() vitals: VitalsResponse | null = null;

  constructor(
    private route: ActivatedRoute,
    private triageFacade: TriageFacade,
    private encounterService: EncounterService,
  ) {
    effect(() => {
      const facadeVitals = this.triageFacade.vitals();
      if (facadeVitals) {
        this.vitals = facadeVitals;
      }
    });
  }

  ngOnInit(): void {
    if (this.vitals) {
      return;
    }

    // Priority: Input encounterId > Input appointmentId > Route appointmentId
    if (this.encounterId) {
      this.triageFacade.loadVitals(this.encounterId);
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
            // Check if vitals are included in encounter response
            if (encounter.vitals) {
              this.vitals = encounter.vitals as unknown as VitalsResponse;
            } else {
              this.triageFacade.loadVitals(encounter.id);
            }
          },
          error: () => {
            // No encounter yet or error
            console.log('No encounter found for this appointment');
          },
        });
    }
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
