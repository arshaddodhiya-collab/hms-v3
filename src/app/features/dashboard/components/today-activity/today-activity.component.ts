import { Component, OnInit } from '@angular/core';
import { MockAuthService } from '../../../auth/services/mock-auth.service';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';

@Component({
  selector: 'app-today-activity',
  templateUrl: './today-activity.component.html',
  styleUrls: ['./today-activity.component.scss'],
})
export class TodayActivityComponent implements OnInit {
  activities: any[] = [];
  cols: any[] = [];

  constructor(private authService: MockAuthService) { }

  ngOnInit() {
    this.setupTable();
    this.loadActivities();
  }

  setupTable() {
    this.cols = [
      { field: 'time', header: 'Time' },
      { field: 'description', header: 'Activity' },
      { field: 'status', header: 'Status' },
    ];
  }

  loadActivities() {
    // Mocking different activities based on role permission
    const allActivities = [
      {
        time: '09:00 AM',
        description: 'Dr. Smith started consultation',
        status: 'In Progress',
        permission: PERMISSIONS.MOD_CONSULTATION,
      },
      {
        time: '09:15 AM',
        description: 'Patient John Doe registered',
        status: 'Completed',
        permission: PERMISSIONS.CMP_PATIENT_ADD,
      },
      {
        time: '09:30 AM',
        description: 'Lab Result: Blood Test (Jane)',
        status: 'Pending',
        permission: PERMISSIONS.MOD_LAB,
      },
      {
        time: '10:00 AM',
        description: 'Invoice #1023 Generated',
        status: 'Paid',
        permission: PERMISSIONS.MOD_BILLING,
      },
      {
        time: '10:15 AM',
        description: 'Emergency: Bed 4 Vitals',
        status: 'Critical',
        permission: PERMISSIONS.MOD_TRIAGE,
      },
    ];

    this.activities = allActivities.filter((act) =>
      this.authService.hasPermission(act.permission),
    );
  }
}
