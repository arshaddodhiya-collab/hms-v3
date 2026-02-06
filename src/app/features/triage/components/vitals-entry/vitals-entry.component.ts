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
  ) { }

  ngOnInit(): void {
    this.appointmentId = this.route.snapshot.paramMap.get('appointmentId');
    if (!this.appointmentId) {
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

  saveVitals() {
    if (!this.appointmentId) return;

    this.loading = true;
    const report = {
      appointmentId: +this.appointmentId,
      ...this.vitals,
    };
    report.recordedAt = new Date();

    this.triageService.saveVitals(report).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Vitals Recorded',
        });
        this.router.navigate(['/triage']); // Go back to queue
      },
      error: () => {
        this.loading = false;
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
