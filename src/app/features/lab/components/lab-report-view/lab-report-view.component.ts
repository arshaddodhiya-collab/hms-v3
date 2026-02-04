import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LabService, LabRequest } from '../../../../core/services/lab.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-lab-report-view',
  templateUrl: './lab-report-view.component.html',
  styleUrls: ['./lab-report-view.component.scss'],
})
export class LabReportViewComponent implements OnInit {
  requestId: string | null = null;
  request: LabRequest | undefined;

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
        this.router.navigate(['/lab']);
      }
    }
  }

  goBack(): void {
    this.location.back();
  }

  print(): void {
    window.print();
  }
}
