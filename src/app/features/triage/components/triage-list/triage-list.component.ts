import {
  Component,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';
import { TableColumn } from '../../../../shared/models/table.model';

interface QueueItem {
  id: number;
  patientName: string;
  doctorName: string;
  status: string;
  time: string;
  priority: string;
}

@Component({
  selector: 'app-triage-list',
  templateUrl: './triage-list.component.html',
  styleUrls: ['./triage-list.component.scss'],
})
export class TriageListComponent implements AfterViewInit {
  permissions = PERMISSIONS;
  @ViewChild('priorityTemplate') priorityTemplate!: TemplateRef<{
    $implicit: unknown;
    row: QueueItem;
  }>;
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<{
    $implicit: unknown;
    row: QueueItem;
  }>;

  // Mock Data - in real app would come from service filtering for 'Checked In' or 'Triaged'
  triageQueue: QueueItem[] = [
    {
      id: 101,
      patientName: 'John Doe',
      doctorName: 'Dr. Smith',
      status: 'Checked In',
      time: '10:00 AM',
      priority: 'Normal',
    },
    {
      id: 102,
      patientName: 'Jane Smith',
      doctorName: 'Dr. Jones',
      status: 'Triaged',
      time: '10:15 AM',
      priority: 'High',
    },
    {
      id: 103,
      patientName: 'Bob Brown',
      doctorName: 'Dr. Smith',
      status: 'Checked In',
      time: '10:30 AM',
      priority: 'Emergency',
    },
  ];

  cols: TableColumn<QueueItem>[] = [
    { field: 'id', header: 'ID' },
    { field: 'patientName', header: 'Patient' },
    { field: 'doctorName', header: 'Doctor' },
    { field: 'time', header: 'Time' },
    { field: 'priority', header: 'Priority' },
    { field: 'status', header: 'Status' },
  ];

  constructor() {}

  ngAfterViewInit() {
    const priorityCol = this.cols.find((c) => c.field === 'priority');
    if (priorityCol) priorityCol.template = this.priorityTemplate;

    const statusCol = this.cols.find((c) => c.field === 'status');
    if (statusCol) statusCol.template = this.statusTemplate;
  }
}
