import { Component, OnInit } from '@angular/core';
import {
  DashboardService,
  ActivityDTO,
} from '../../services/dashboard.service';
import { AuthService } from '../../../auth/services/auth.service';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';

@Component({
  selector: 'app-today-activity',
  templateUrl: './today-activity.component.html',
  styleUrls: ['./today-activity.component.scss'],
})
export class TodayActivityComponent implements OnInit {
  activities: any[] = [];
  cols: any[] = [];

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
  ) {}

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
    this.dashboardService.getRecentActivity().subscribe(
      (data: ActivityDTO[]) => {
        // Map API data to UI format
        const allActivities = data.map((act) => ({
          time: new Date(act.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          description: act.description,
          status: act.status,
          permission: this.getPermissionForRole(act.userRoleRequiringAccess),
        }));

        this.activities = allActivities.filter((act) =>
          this.authService.hasPermission(act.permission),
        );
      },
      (error) => {
        console.error('TodayActivity: Error loading activities', error);
      },
    );
  }

  getPermissionForRole(role: string): string {
    switch (role) {
      case 'DOCTOR':
        return PERMISSIONS.MOD_CONSULTATION;
      case 'NURSE':
        return PERMISSIONS.MOD_LAB;
      case 'RECEPTIONIST':
        return PERMISSIONS.CMP_PATIENT_ADD;
      case 'ADMIN':
        return PERMISSIONS.MOD_BILLING;
      default:
        return PERMISSIONS.MOD_DASHBOARD;
    }
  }
}
