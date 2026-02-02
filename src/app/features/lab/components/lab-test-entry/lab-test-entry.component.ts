import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import {
  LabService,
  LabRequest,
  LabTestResult,
} from '../../services/lab.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-lab-test-entry',
  templateUrl: './lab-test-entry.component.html',
  styleUrls: ['./lab-test-entry.component.scss'],
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
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.requestId = this.route.snapshot.paramMap.get('requestId');
    if (this.requestId) {
      this.request = this.labService.getRequestById(this.requestId);
      if (!this.request) {
        this.router.navigate(['/lab']);
        return;
      }

      if (this.request.results && this.request.results.length > 0) {
        this.request.results.forEach((result) => this.addResultRow(result));
      } else {
        this.addResultRow();
      }

      if (this.request.technicianNotes) {
        this.labForm.patchValue({
          technicianNotes: this.request.technicianNotes,
        });
      }
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

  addResultRow(data?: LabTestResult): void {
    const results = this.labForm.get('results') as FormArray;
    results.push(
      this.fb.group({
        parameter: [data?.parameter || '', Validators.required],
        value: [data?.value || '', Validators.required],
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
      this.labService.addResult(
        this.requestId,
        formValue.results,
        formValue.technicianNotes,
      );
      this.router.navigate(['/lab']);
    } else {
      this.labForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.location.back();
  }
}
