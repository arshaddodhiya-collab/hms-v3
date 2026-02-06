import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { IpdService } from '../../services/ipd.service';
import {
  BillingService,
  Invoice,
} from '../../../billing/services/billing.service';
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
    private billingService: BillingService,
    private messageService: MessageService,
  ) { }

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

      // 1. Discharge Patient
      this.ipdService.dischargePatient(this.admission.id).subscribe(() => {
        // 2. Generate Invoice
        // Mock calculation: 5 days * 500/day
        const days = 5;
        const dailyRate = 500;
        const total = days * dailyRate;

        const invoice: Invoice = {
          id: 0,
          patientId: this.admission!.patientId,
          patientName: this.admission!.patientName,
          date: new Date(),
          items: [
            {
              description: `Inpatient Charges (${days} days @ ${dailyRate})`,
              amount: total,
            },
            { description: 'Nursing Charges', amount: 200 },
          ],
          totalAmount: 0, // Service calculates this
          status: 'Pending',
          notes: 'Auto-generated upon discharge',
        };

        this.billingService.createInvoice(invoice).subscribe(() => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Patient Discharged & Bill Generated',
          });
          this.router.navigate(['/ipd/admissions']);
        });
      });
    }
  }

  cancel() {
    this.router.navigate(['/ipd/admissions']);
  }
}
