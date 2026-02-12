import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TriageService } from '../../services/triage.service';

@Component({
  selector: 'app-vitals-entry',
  templateUrl: './vitals-entry.component.html',
  styleUrls: ['./vitals-entry.component.scss'],
})
export class VitalsEntryComponent implements OnInit {
  appointmentId: string | null = null;
  encounterId: number | null = null;
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

  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private triageService: TriageService,
  ) {}

  ngOnInit(): void {
    const encIdStr = this.route.snapshot.paramMap.get('encounterId');
    if (encIdStr) {
      this.encounterId = +encIdStr;
    } else {
      this.cancel();
    }
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

  get isValid(): boolean {
    return (
      !!this.vitals.temperature ||
      !!this.vitals.systolic ||
      !!this.vitals.diastolic ||
      !!this.vitals.pulse ||
      !!this.vitals.spo2 ||
      !!this.vitals.weight ||
      !!this.vitals.height
    );
  }

  saveVitals() {
    if (!this.encounterId || !this.isValid) return;

    this.loading = true;

    // Create VitalsRequest object
    const request = {
      temperature: this.vitals.temperature,
      systolic: this.vitals.systolic,
      diastolic: this.vitals.diastolic,
      pulse: this.vitals.pulse,
      spo2: this.vitals.spo2,
      weight: this.vitals.weight,
      height: this.vitals.height,
    };

    this.triageService.saveVitals(this.encounterId, request).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Vitals Recorded',
        });
        this.router.navigate(['/triage']); // Go back to queue
      },
      error: (err) => {
        this.loading = false;
        console.error('Failed to save vitals', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save',
        });
      },
    });
  }

  cancel() {
    this.router.navigate(['/triage']); // Back to queue
  }
}
