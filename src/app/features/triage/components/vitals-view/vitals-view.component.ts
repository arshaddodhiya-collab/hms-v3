import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  TriageService,
  Vitals,
} from '../../../../core/services/triage.service';

@Component({
  selector: 'app-vitals-view',
  templateUrl: './vitals-view.component.html',
  styleUrls: ['./vitals-view.component.scss'],
})
export class VitalsViewComponent implements OnInit {
  @Input() appointmentId: string | number | null = null;
  vitals: Vitals | null | undefined = null;

  constructor(
    private route: ActivatedRoute,
    private triageService: TriageService,
  ) {}

  ngOnInit(): void {
    // Priority: Input > Route Param
    if (!this.appointmentId) {
      this.appointmentId = this.route.snapshot.paramMap.get('appointmentId');
    }

    if (this.appointmentId) {
      this.triageService.getVitals(+this.appointmentId).subscribe((data) => {
        this.vitals = data;
      });
    }
  }

  isEmergency(type: string, value: number): boolean {
    if (!value) return false;
    if (type === 'systolic' && value > 140) return true;
    if (type === 'diastolic' && value > 90) return true;
    if (type === 'temp' && value > 38) return true;
    if (type === 'spo2' && value < 90) return true;
    return false;
  }
}
