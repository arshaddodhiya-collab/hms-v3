import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vitals-view',
  templateUrl: './vitals-view.component.html',
  styleUrls: ['./vitals-view.component.scss'],
})
export class VitalsViewComponent implements OnInit {
  appointmentId: string | null = null;
  // Mock Data
  vitals: any = {
    temperature: 37.2,
    systolic: 145, // High
    diastolic: 95, // High
    pulse: 102, // High
    spo2: 98,
    weight: 82,
    height: 178,
    bmi: 25.9,
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.appointmentId = this.route.snapshot.paramMap.get('appointmentId');
  }

  isEmergency(type: string, value: number): boolean {
    if (type === 'systolic' && value > 140) return true;
    if (type === 'diastolic' && value > 90) return true;
    if (type === 'temp' && value > 38) return true;
    if (type === 'spo2' && value < 90) return true;
    return false;
  }
}
