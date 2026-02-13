import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LabService } from '../../services/lab.service';
import { LabRequest } from '../../../../core/models/lab.models';
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
    const id = this.route.snapshot.paramMap.get('requestId');
    if (id) {
      this.requestId = id;
      this.labService.getLabRequestById(+id).subscribe(
        (data) => {
          this.request = data;
        },
        (error) => {
          this.router.navigate(['/lab']);
        },
      );
    }
  }

  goBack(): void {
    this.location.back();
  }

  print(): void {
    window.print();
  }
}
