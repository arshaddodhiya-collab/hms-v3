import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  Input,
} from '@angular/core';
import { Router } from '@angular/router';
import { LabService } from '../../services/lab.service';
import { LabRequest } from '../../../../core/models/lab.models';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';
import { TableColumn } from '../../../../shared/models/table.model';

@Component({
  selector: 'app-lab-request-list',
  templateUrl: './lab-request-list.component.html',
  styleUrls: ['./lab-request-list.component.scss'],
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

  requests: LabRequest[] = [];
  permissions = PERMISSIONS;

  @Input() encounterId: number | undefined;

  cols: TableColumn<LabRequest>[] = [
    { field: 'id', header: 'ID' },
    { field: 'createdAt', header: 'Date' },
    { field: 'patientName', header: 'Patient' },
    { field: 'testName', header: 'Test' },
    // { field: 'doctorName', header: 'Doctor' }, // Not in DTO yet
    { field: 'status', header: 'Status' },
  ];

  constructor(
    private labService: LabService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.labService
      .getLabQueue(undefined, this.encounterId)
      .subscribe((data) => {
        this.requests = data;
      });
  }

  ngAfterViewInit() {
    const dateCol = this.cols.find((c) => c.field === 'createdAt');
    if (dateCol) dateCol.template = this.dateTemplate;

    // const priorityCol = this.cols.find((c) => c.field === 'priority');
    // if (priorityCol) priorityCol.template = this.priorityTemplate;

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
