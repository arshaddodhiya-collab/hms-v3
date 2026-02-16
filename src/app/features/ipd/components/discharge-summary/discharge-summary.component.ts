import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { IpdService } from '../../services/ipd.service';

import { Admission } from '../../../../core/models/patient.model';

@Component({
  selector: 'app-discharge-summary',
  templateUrl: './discharge-summary.component.html',
  styleUrls: ['./discharge-summary.component.scss'],
})
export class DischargeSummaryComponent implements OnInit {
  admissionId: number | null = null;
  admission: Admission | null = null;

  dischargeDate: Date = new Date();
  diagnosis: string = '';
  treatmentSummary: string = '';
  advice: string = '';

  loading = false;
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ipdService: IpdService,

    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('admissionId');
    if (id) {
      this.admissionId = +id;
      // In a real app we might have a getAdmissionById, for now filtering list
      this.ipdService.getAdmissions().subscribe((admissions) => {
        this.admission =
          admissions.find((a) => a.id === this.admissionId) || null;
        if (!this.admission) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Admission not found',
          });
          this.router.navigate(['/ipd/admissions']);
        } else {
          this.diagnosis = this.admission.diagnosis || ''; // Pre-fill
        }
      });
    }
  }

  save() {
    this.submitted = true;
    if (this.diagnosis && this.advice && this.admission) {
      this.loading = true;

      const payload = {
        dischargeSummary: this.treatmentSummary, // Mapping treatmentSummary to dischargeSummary
        diagnosis: this.diagnosis,
        advice: this.advice,
        dischargeDate: this.dischargeDate.toISOString(),
      };

      this.ipdService.dischargePatient(this.admission.id, payload).subscribe({
        next: () => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Patient Discharged',
          });
          this.router.navigate(['/ipd/admissions']);
        },
        error: () => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to discharge patient',
          });
        },
      });
    }
  }

  cancel() {
    this.router.navigate(['/ipd/admissions']);
  }
}
