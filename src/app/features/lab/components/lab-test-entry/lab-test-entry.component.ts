import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LabRequest, LabResult } from '../../../../core/models/lab.models';
import { Location } from '@angular/common';
import { LabFacade } from '../../facades/lab.facade';
import { LabService } from '../../services/lab.service';

@Component({
  selector: 'app-lab-test-entry',
  templateUrl: './lab-test-entry.component.html',
  styleUrls: ['./lab-test-entry.component.scss'],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabTestEntryComponent implements OnInit {
  requestId: string | null = null;
  request: LabRequest | undefined;
  test: any = {};
  labForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public facade: LabFacade,
    private labService: LabService,
    private location: Location,
    private fb: FormBuilder,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.initForm();
    const id = this.route.snapshot.paramMap.get('requestId');
    if (id) {
      this.requestId = id;
      this.loadRequest(+id);
    }
  }

  initForm() {
    this.labForm = this.fb.group({
      results: this.fb.array([]),
      technicianNotes: [''],
    });
  }

  loadRequest(id: number) {
    this.labService.getLabRequestById(id).subscribe({
      next: (data) => {
        this.request = data;
        if (!this.request) {
          this.router.navigate(['/lab']);
          return;
        }

        if (
          this.request.status === 'COMPLETED' ||
          this.request.status === 'CANCELLED'
        ) {
          this.messageService.add({
            severity: 'warn',
            summary: 'ReadOnly',
            detail: 'Result entry is not allowed for this status',
          });
          this.labForm.disable();
        }

        if (this.request.results && this.request.results.length > 0) {
          this.request.results.forEach((result: LabResult) =>
            this.addResultRow(result),
          );
        } else if (
          this.request.parameters &&
          this.request.parameters.length > 0
        ) {
          this.request.parameters.forEach((param: any) =>
            this.addResultRow({
              parameterName: param.parameterName,
              resultValue: '',
              unit: param.unit,
              referenceRange: param.referenceRange,
              isAbnormal: false,
            } as any),
          );
        } else {
          this.addResultRow();
        }

        if (this.request.technicianNotes) {
          this.labForm.patchValue({
            technicianNotes: this.request.technicianNotes,
          });
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load lab request',
        });
        this.router.navigate(['/lab']);
      },
    });
  }

  get resultsControls() {
    return (this.labForm.get('results') as FormArray).controls;
  }

  addResultRow(data?: LabResult): void {
    const results = this.labForm.get('results') as FormArray;
    results.push(
      this.fb.group({
        parameter: [
          data?.parameterName || '',
          [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s\(\)\-\.]+$/)],
        ],
        value: [
          data?.resultValue || '',
          [
            Validators.required,
            Validators.pattern(/^[a-zA-Z0-9\s\.\-\+\<\>\/\%]+$/),
          ],
        ],
        unit: [
          data?.unit || '',
          [Validators.pattern(/^[a-zA-Z0-9\s\/\%\^\(\)]*$/)],
        ],
        referenceRange: [
          data?.referenceRange || this.request?.referenceRange || '',
          [Validators.pattern(/^[a-zA-Z0-9\s\.\-\+\<\>]*$/)],
        ],
        isAbnormal: [data?.isAbnormal || false],
      }),
    );
  }

  removeResultRow(index: number): void {
    const results = this.labForm.get('results') as FormArray;
    results.removeAt(index);
  }

  saveResults(): void {
    if (!this.requestId || !this.request) return;

    if (this.labForm.invalid) {
      this.labForm.markAllAsTouched();
      return;
    }

    const formValue = this.labForm.value;
    const parameters = formValue.results.map((r: any) =>
      r.parameter.toLowerCase().trim(),
    );
    const hasDuplicates = parameters.some(
      (item: string, index: number) => parameters.indexOf(item) !== index,
    );

    if (hasDuplicates) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Duplicate parameters are not allowed.',
      });
      return;
    }

    const results = formValue.results.map((r: any) => ({
      parameterName: r.parameter,
      resultValue: r.value,
      unit: r.unit,
      referenceRange: r.referenceRange,
      isAbnormal: r.isAbnormal,
    }));

    this.facade.addResults(+this.requestId, results, () => {
      setTimeout(() => this.router.navigate(['/lab']), 1000);
    });
  }

  cancel(): void {
    this.location.back();
  }
}
