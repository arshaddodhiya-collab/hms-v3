import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TriageService } from '../../services/triage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-vitals-entry',
  templateUrl: './vitals-entry.component.html',
  styleUrls: ['./vitals-entry.component.scss'],
})
export class VitalsEntryComponent implements OnInit {
  appointmentId: string | null = null;
  encounterId: number | null = null;
  vitalsForm: FormGroup;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private triageService: TriageService,
    private fb: FormBuilder,
  ) {
    this.vitalsForm = this.fb.group({
      temperature: [null, [Validators.min(30), Validators.max(45)]],
      systolic: [null, [Validators.min(50), Validators.max(300)]],
      diastolic: [null, [Validators.min(20), Validators.max(200)]],
      pulse: [null, [Validators.min(20), Validators.max(300)]],
      spo2: [null, [Validators.min(0), Validators.max(100)]],
      weight: [null, [Validators.min(0.5), Validators.max(500)]],
      height: [null, [Validators.min(30), Validators.max(300)]],
    });
  }

  ngOnInit(): void {
    const encIdStr = this.route.snapshot.paramMap.get('encounterId');
    if (encIdStr) {
      this.encounterId = +encIdStr;
    } else {
      this.cancel();
    }
  }

  get bmi(): string | null {
    const weight = this.vitalsForm.get('weight')?.value;
    const height = this.vitalsForm.get('height')?.value;
    if (weight && height) {
      const heightInMeters = height / 100;
      return (weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return null;
  }

  /** At least one vital must be filled in */
  get hasAtLeastOneVital(): boolean {
    const v = this.vitalsForm.value;
    return Object.values(v).some((val) => val !== null && val !== '');
  }

  saveVitals() {
    this.vitalsForm.markAllAsTouched();

    if (this.vitalsForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please correct the highlighted fields.',
      });
      return;
    }

    if (!this.encounterId || !this.hasAtLeastOneVital) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter at least one vital sign.',
      });
      return;
    }

    this.loading = true;
    const { temperature, systolic, diastolic, pulse, spo2, weight, height } =
      this.vitalsForm.value;
    const request = {
      temperature,
      systolic,
      diastolic,
      pulse,
      spo2,
      weight,
      height,
    };

    this.triageService.saveVitals(this.encounterId, request).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Vitals Recorded',
        });
        this.router.navigate(['/triage']);
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
    this.router.navigate(['/triage']);
  }
}
