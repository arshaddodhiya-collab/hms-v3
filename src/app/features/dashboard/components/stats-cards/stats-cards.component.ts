import { Component, OnInit } from '@angular/core';
import {
  DashboardService,
  DashboardDTO,
} from '../../services/dashboard.service';

import { PERMISSIONS } from '../../../../core/constants/permissions.constants';
import { MockAuthService } from '../../../auth/services/mock-auth.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-stats-cards',
  templateUrl: './stats-cards.component.html',
  styleUrls: ['./stats-cards.component.scss'],
})
export class StatsCardsComponent implements OnInit {
  stats: any[] = [];

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    console.log('StatsCards: Loading stats...');
    this.dashboardService.getStats().subscribe(
      (data: DashboardDTO) => {
        console.log('StatsCards: Received data', data);
        const allStats = [
          {
            label: 'Total Patients',
            value: data.totalPatients,
            icon: 'pi pi-users',
            color: 'green',
            permission: PERMISSIONS.MOD_PATIENTS,
          },
          {
            label: "Today's Appointments",
            value: data.expectedAppointmentsToday,
            icon: 'pi pi-calendar',
            color: 'orange',
            permission: PERMISSIONS.MOD_APPOINTMENTS,
          },
          {
            label: 'Pending Labs',
            value: data.pendingLabRequests,
            icon: 'pi pi-flask',
            color: 'purple',
            permission: PERMISSIONS.MOD_LAB,
          },
          {
            label: 'Revenue (Today)',
            value: '$' + data.todaysRevenue,
            icon: 'pi pi-dollar',
            color: 'green',
            permission: PERMISSIONS.MOD_BILLING,
          },
          {
            label: 'Critical / Admitted',
            value: data.criticalPatientsCount,
            icon: 'pi pi-heart',
            color: 'red',
            permission: PERMISSIONS.MOD_TRIAGE,
          },
        ];

        // Filter stats based on permissions
        this.stats = allStats.filter((stat) => {
          const hasPerm = this.authService.hasPermission(stat.permission);
          console.log(
            `StatsCards: Checking permission ${stat.permission}: ${hasPerm}`,
          );
          return hasPerm;
        });
        console.log('StatsCards: Filtered stats', this.stats);
      },
      (error) => {
        console.error('StatsCards: Error loading stats', error);
      },
    );
  }
}
