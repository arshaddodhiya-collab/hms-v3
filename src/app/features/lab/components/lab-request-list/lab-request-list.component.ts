import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { LabService, LabRequest } from '../../../../core/services/lab.service';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';

@Component({
  selector: 'app-lab-request-list',
  templateUrl: './lab-request-list.component.html',
  styleUrls: ['./lab-request-list.component.scss'],
})
export class LabRequestListComponent implements OnInit, AfterViewInit {
  @ViewChild('dateTemplate') dateTemplate!: TemplateRef<any>;
  @ViewChild('priorityTemplate') priorityTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;

  requests: LabRequest[] = [];
  permissions = PERMISSIONS;

  cols: any[] = [
    { field: 'id', header: 'ID' },
    { field: 'requestDate', header: 'Date' },
    { field: 'patientName', header: 'Patient' },
    { field: 'testName', header: 'Test' },
    { field: 'doctorName', header: 'Doctor' },
    { field: 'priority', header: 'Priority' },
    { field: 'status', header: 'Status' },
  ];

  constructor(
    private labService: LabService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.labService.getAllRequests().subscribe((data) => {
      this.requests = data;
    });
  }

  ngAfterViewInit() {
    const dateCol = this.cols.find((c) => c.field === 'requestDate');
    if (dateCol) dateCol.template = this.dateTemplate;

    const priorityCol = this.cols.find((c) => c.field === 'priority');
    if (priorityCol) priorityCol.template = this.priorityTemplate;

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
