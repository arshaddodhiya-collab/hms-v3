import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';

@Component({
  selector: 'app-triage-list',
  templateUrl: './triage-list.component.html',
  styleUrls: ['./triage-list.component.scss'],
})
export class TriageListComponent implements OnInit, AfterViewInit {
  permissions = PERMISSIONS;
  @ViewChild('priorityTemplate') priorityTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;

  // Mock Data - in real app would come from service filtering for 'Checked In' or 'Triaged'
  triageQueue = [
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

  cols: any[] = [
    { field: 'id', header: 'ID' },
    { field: 'patientName', header: 'Patient' },
    { field: 'doctorName', header: 'Doctor' },
    { field: 'time', header: 'Time' },
    { field: 'priority', header: 'Priority' },
    { field: 'status', header: 'Status' },
  ];

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    const priorityCol = this.cols.find((c) => c.field === 'priority');
    if (priorityCol) priorityCol.template = this.priorityTemplate;

    const statusCol = this.cols.find((c) => c.field === 'status');
    if (statusCol) statusCol.template = this.statusTemplate;
  }
}
