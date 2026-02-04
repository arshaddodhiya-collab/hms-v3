import { Component, OnInit } from '@angular/core';
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
  appointmentId: string | null = null;
  vitals: Vitals | null | undefined = null;

  constructor(
    private route: ActivatedRoute,
    private triageService: TriageService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('appointmentId');
    if (id) {
      this.appointmentId = id;
      this.triageService.getVitals(+id).subscribe((data) => {
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
