import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LabService } from '../../services/lab.service';
import { CreateLabRequest, LabTest } from '../../../../core/models/lab.models';
import { PatientService } from '../../../patients/services/patient.service';
import { Patient } from '../../../../core/models/patient.model';

@Component({
  selector: 'app-test-request',
  templateUrl: './test-request.component.html',
  styleUrl: './test-request.component.scss',
})
export class TestRequestComponent implements OnInit {
  patients: Patient[] = [];
  tests: LabTest[] = [];
  selectedPatient: number | null = null;
  selectedTest: number | null = null;
  notes: string = '';

  loading = false;
  submitted = false;
  encounterId: number | null = null;

  constructor(
    private labService: LabService,
    private patientService: PatientService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.patientService.getPatients().subscribe((data) => {
      const content = data.content || data;
      this.patients = content.map((p: Patient) => ({
        ...p,
        name: `${p.firstName} ${p.lastName}`,
      }));
      this.checkParams();
    });
    this.labService.getAllLabTests().subscribe((data) => (this.tests = data));
  }

  checkParams() {
    this.route.queryParams.subscribe((params) => {
      if (params['encounterId']) {
        this.encounterId = +params['encounterId'];
      }
      if (params['patientId']) {
        // Dropdown now expects ID, not object
        this.selectedPatient = +params['patientId'];
      }
    });
  }

  save() {
    this.submitted = true;
    if (this.selectedPatient && this.selectedTest) {
      this.loading = true;

      const request: CreateLabRequest = {
        encounterId: this.encounterId || 1, // Fallback to 1 if not provided (should be handled)
        patientId: this.selectedPatient,
        labTestId: this.selectedTest,
        notes: this.notes,
      };

      this.labService.createLabRequest(request).subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Test Requested',
        });
        if (this.encounterId) {
          // Go back to consultation if we came from there
          // Unfortunately we don't know the appointmentId easily unless passed.
          // But we can go back in history or just to lab queue.
          // For now, go to lab queue as before.
          this.router.navigate(['/lab']);
        } else {
          this.router.navigate(['/lab']);
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/lab']);
  }
}
