import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LabRequest } from '../../../../core/models/lab.models';
import { Location } from '@angular/common';
import { LabFacade } from '../../facades/lab.facade';
import { LabService } from '../../services/lab.service';

@Component({
  selector: 'app-lab-report-view',
  templateUrl: './lab-report-view.component.html',
  styleUrls: ['./lab-report-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabReportViewComponent implements OnInit {
  requestId: string | null = null;
  request: LabRequest | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public facade: LabFacade,
    private labService: LabService,
    private location: Location,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('requestId');
    if (id) {
      this.requestId = id;
      this.labService.getLabRequestById(+id).subscribe(
        (data) => {
          this.request = data;
          this.cdr.markForCheck();
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

  downloadPdf(): void {
    if (!this.request) return;
    this.labService.downloadLabReportPdf(this.request.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `LabReport_${this.request!.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Failed to download PDF', err);
        // Error handling could use messageService if it was injected
      },
    });
  }
}
