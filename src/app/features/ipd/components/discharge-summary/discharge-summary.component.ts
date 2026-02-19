import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Admission } from '../../../../core/models/patient.model';
import { IpdFacade } from '../../facades/ipd.facade';

@Component({
  selector: 'app-discharge-summary',
  templateUrl: './discharge-summary.component.html',
  styleUrls: ['./discharge-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DischargeSummaryComponent implements OnInit {
  admissionId: number | null = null;
  admission: Admission | null = null;

  // Form-local state
  dischargeDate: Date = new Date();
  diagnosis: string = '';
  treatmentSummary: string = '';
  advice: string = '';
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public facade: IpdFacade,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('admissionId');
    if (id) {
      this.admissionId = +id;
      // Load admissions via facade, then find the target
      this.facade.loadAdmissions();
      // Use a simple check after load completes — admissions are a signal
      // We'll watch for the data via effect-like approach in ngOnInit
      const checkAdmission = () => {
        const admissions = this.facade.admissions();
        if (admissions.length > 0) {
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
            this.diagnosis = this.admission.diagnosis || '';
          }
        }
      };
      // Retry after a small delay to allow the signal to populate
      setTimeout(checkAdmission, 1000);
    }
  }

  save() {
    this.submitted = true;
    if (this.diagnosis && this.advice && this.admission) {
      const payload = {
        dischargeSummary: this.treatmentSummary,
        diagnosis: this.diagnosis,
        advice: this.advice,
        dischargeDate: this.dischargeDate.toISOString(),
      };

      this.facade.dischargePatient(this.admission.id, payload, () => {
        this.router.navigate(['/ipd/admissions']);
      });
    }
  }

  cancel() {
    this.router.navigate(['/ipd/admissions']);
  }
}
