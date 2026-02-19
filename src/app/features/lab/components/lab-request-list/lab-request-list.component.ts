import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LabRequest } from '../../../../core/models/lab.models';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';
import { TableColumn } from '../../../../shared/models/table.model';
import { LabFacade } from '../../facades/lab.facade';

@Component({
  selector: 'app-lab-request-list',
  templateUrl: './lab-request-list.component.html',
  styleUrls: ['./lab-request-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabRequestListComponent implements OnInit, AfterViewInit {
  @ViewChild('dateTemplate') dateTemplate!: TemplateRef<{
    $implicit: unknown;
    row: LabRequest;
  }>;
  @ViewChild('priorityTemplate') priorityTemplate!: TemplateRef<{
    $implicit: unknown;
    row: LabRequest;
  }>;
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<{
    $implicit: unknown;
    row: LabRequest;
  }>;

  permissions = PERMISSIONS;

  @Input() encounterId: number | undefined;

  cols: TableColumn<LabRequest>[] = [
    { field: 'id', header: 'ID' },
    { field: 'createdAt', header: 'Date' },
    { field: 'patientName', header: 'Patient' },
    { field: 'testName', header: 'Test' },
    { field: 'status', header: 'Status' },
  ];

  constructor(
    public facade: LabFacade,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    if (!this.encounterId) {
      this.route.queryParams.subscribe((params) => {
        if (params['encounterId']) {
          this.encounterId = +params['encounterId'];
        }
        this.facade.loadQueue(undefined, this.encounterId);
      });
    } else {
      this.facade.loadQueue(undefined, this.encounterId);
    }
  }

  ngAfterViewInit() {
    const dateCol = this.cols.find((c) => c.field === 'createdAt');
    if (dateCol) dateCol.template = this.dateTemplate;

    const statusCol = this.cols.find((c) => c.field === 'status');
    if (statusCol) statusCol.template = this.statusTemplate;
  }

  enterResults(id: string): void {
    this.router.navigate(['/lab/entry', id]);
  }

  viewReport(id: string): void {
    this.router.navigate(['/lab/view', id]);
  }
}
