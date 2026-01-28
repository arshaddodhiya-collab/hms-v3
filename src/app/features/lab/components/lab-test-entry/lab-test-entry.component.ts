import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  results: LabTestResult[] = [];
  technicianNotes: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private labService: LabService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.requestId = this.route.snapshot.paramMap.get('requestId');
    if (this.requestId) {
      this.request = this.labService.getRequestById(this.requestId);
      if (!this.request) {
        // Handle not found
        this.router.navigate(['/lab']);
        return;
      }
      // Initialize with one empty row if no results yet
      if (this.request.results && this.request.results.length > 0) {
        this.results = JSON.parse(JSON.stringify(this.request.results));
      } else {
        this.addResultRow();
      }
      if (this.request.technicianNotes) {
        this.technicianNotes = this.request.technicianNotes;
      }
    }
  }

  addResultRow(): void {
    this.results.push({
      parameter: '',
      value: '',
      unit: '',
      referenceRange: '',
      isAbnormal: false,
    });
  }

  removeResultRow(index: number): void {
    this.results.splice(index, 1);
  }

  saveResults(): void {
    if (this.requestId && this.request) {
      // Filter out empty rows
      const validResults = this.results.filter(
        (r) => r.parameter.trim() !== '',
      );
      this.labService.addResult(
        this.requestId,
        validResults,
        this.technicianNotes,
      );
      this.router.navigate(['/lab']);
    }
  }

  cancel(): void {
    this.location.back();
  }
}
