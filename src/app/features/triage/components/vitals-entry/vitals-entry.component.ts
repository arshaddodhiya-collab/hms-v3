import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vitals-entry',
  templateUrl: './vitals-entry.component.html',
  styleUrls: ['./vitals-entry.component.scss'],
})
export class VitalsEntryComponent implements OnInit {
  appointmentId: string | null = null;
  vitals: any = {
    temperature: null,
    systolic: null,
    diastolic: null,
    pulse: null,
    spo2: null,
    weight: null,
    height: null,
    bmi: null,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.appointmentId = this.route.snapshot.paramMap.get('appointmentId');
  }

  calculateBMI() {
    if (this.vitals.weight && this.vitals.height) {
      const heightInMeters = this.vitals.height / 100;
      this.vitals.bmi = (
        this.vitals.weight /
        (heightInMeters * heightInMeters)
      ).toFixed(1);
    }
  }

  saveVitals() {
    console.log(
      'Saving vitals for appointment',
      this.appointmentId,
      this.vitals,
    );
    // Mimic API call
    setTimeout(() => {
      this.router.navigate(['/appointments']);
    }, 500);
  }

  cancel() {
    this.router.navigate(['/appointments']);
  }
}
