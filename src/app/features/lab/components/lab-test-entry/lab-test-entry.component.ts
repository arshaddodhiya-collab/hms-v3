import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LabService } from '../../services/lab.service';
import { LabRequest, LabResult } from '../../../../core/models/lab.models';
import { Location } from '@angular/common';

@Component({
  selector: 'app-lab-test-entry',
  templateUrl: './lab-test-entry.component.html',
  styleUrls: ['./lab-test-entry.component.scss'],
  providers: [MessageService],
})
export class LabTestEntryComponent implements OnInit {
  requestId: string | null = null;
  request: LabRequest | undefined;
  test: any = {};
  labForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private labService: LabService,
    private location: Location,
    private fb: FormBuilder,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    const id = this.route.snapshot.paramMap.get('requestId');
    if (id) {
      this.requestId = id;
      this.labService.getLabRequestById(+id).subscribe((data) => {
        this.request = data;
        if (!this.request) {
          this.router.navigate(['/lab']);
          return;
        }

        if (this.request.results && this.request.results.length > 0) {
          this.request.results.forEach((result: LabResult) =>
            this.addResultRow(result),
          );
        } else {
          this.addResultRow();
        }

        if (this.request.technicianNotes) {
          this.labForm.patchValue({
            technicianNotes: this.request.technicianNotes,
          });
        }
      });
    }
  }

  initForm() {
    this.labForm = this.fb.group({
      results: this.fb.array([]),
      technicianNotes: [''],
    });
  }

  get resultsControls() {
    return (this.labForm.get('results') as FormArray).controls;
  }

  addResultRow(data?: LabResult): void {
    const results = this.labForm.get('results') as FormArray;
    results.push(
      this.fb.group({
        parameter: [data?.parameterName || '', Validators.required],
        value: [data?.resultValue || '', Validators.required],
        unit: [data?.unit || ''],
        referenceRange: [data?.referenceRange || ''],
        isAbnormal: [data?.isAbnormal || false],
      }),
    );
  }

  removeResultRow(index: number): void {
    const results = this.labForm.get('results') as FormArray;
    results.removeAt(index);
  }

  saveResults(): void {
    if (this.requestId && this.request && this.labForm.valid) {
      const formValue = this.labForm.value;
      const results = formValue.results.map((r: any) => ({
        parameterName: r.parameter,
        resultValue: r.value,
        unit: r.unit,
        referenceRange: r.referenceRange,
        isAbnormal: r.isAbnormal,
      }));

      this.labService.addResults(+this.requestId, results).subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Results saved',
        });
        this.router.navigate(['/lab']);
      });
    } else {
      this.labForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.location.back();
  }
}
