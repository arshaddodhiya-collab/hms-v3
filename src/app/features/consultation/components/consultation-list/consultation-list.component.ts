import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';

@Component({
  selector: 'app-consultation-list',
  templateUrl: './consultation-list.component.html',
  styleUrls: ['./consultation-list.component.scss'],
})
export class ConsultationListComponent implements OnInit, AfterViewInit {
  @ViewChild('patientNameTemplate') patientNameTemplate!: TemplateRef<any>;
  @ViewChild('ageTemplate') ageTemplate!: TemplateRef<any>;
  @ViewChild('priorityTemplate') priorityTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;

  permissions = PERMISSIONS;

  // Mock Data - representing patients who have completed Triage
  consultationQueue = [
    {
      id: 101,
      patientName: 'John Doe',
      age: 30,
      gender: 'Male',
      priority: 'Normal',
      waitTime: '15 mins',
      status: 'Waiting',
    },
    {
      id: 102,
      patientName: 'Jane Smith',
      age: 25,
      gender: 'Female',
      priority: 'High',
      waitTime: '30 mins',
      status: 'Waiting',
    },
    {
      id: 103,
      patientName: 'Bob Brown',
      age: 45,
      gender: 'Male',
      priority: 'Emergency',
      waitTime: '5 mins',
      status: 'Waiting',
    },
  ];

  cols: any[] = [
    { field: 'patientName', header: 'Patient' },
    { field: 'age', header: 'Age/Gender' }, // We'll use a template for this composite
    { field: 'priority', header: 'Priority' },
    { field: 'waitTime', header: 'Wait Time' },
    { field: 'status', header: 'Status' },
  ];

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    const patientCol = this.cols.find((c) => c.field === 'patientName');
    if (patientCol) patientCol.template = this.patientNameTemplate;

    const ageCol = this.cols.find((c) => c.field === 'age');
    if (ageCol) ageCol.template = this.ageTemplate;

    const priorityCol = this.cols.find((c) => c.field === 'priority');
    if (priorityCol) priorityCol.template = this.priorityTemplate;

    const statusCol = this.cols.find((c) => c.field === 'status');
    if (statusCol) statusCol.template = this.statusTemplate;
  }
}
