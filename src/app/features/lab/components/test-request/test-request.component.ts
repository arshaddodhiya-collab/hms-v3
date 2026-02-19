import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CreateLabRequest } from '../../../../core/models/lab.models';
import { Patient } from '../../../../core/models/patient.model';
import { PatientService } from '../../../patients/services/patient.service';
import { LabFacade } from '../../facades/lab.facade';

@Component({
  selector: 'app-test-request',
  templateUrl: './test-request.component.html',
  styleUrl: './test-request.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestRequestComponent implements OnInit {
  patients: Patient[] = [];
  selectedPatient: number | null = null;
  selectedTest: number | null = null;
  notes: string = '';
  submitted = false;
  encounterId: number | null = null;

  constructor(
    public facade: LabFacade,
    private patientService: PatientService,
    // private messageService: MessageService,
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
    this.facade.loadLabTests();
  }

  checkParams() {
    this.route.queryParams.subscribe((params) => {
      if (params['encounterId']) {
        this.encounterId = +params['encounterId'];
      }
      if (params['patientId']) {
        this.selectedPatient = +params['patientId'];
      }
    });
  }

  save() {
    this.submitted = true;
    if (this.selectedPatient && this.selectedTest) {
      const request: CreateLabRequest = {
        encounterId: this.encounterId || 1,
        patientId: this.selectedPatient,
        labTestId: this.selectedTest,
        notes: this.notes,
      };

      this.facade.createRequest(request, () => {
        this.router.navigate(['/lab']);
      });
    }
  }

  cancel() {
    this.router.navigate(['/lab']);
  }
}
