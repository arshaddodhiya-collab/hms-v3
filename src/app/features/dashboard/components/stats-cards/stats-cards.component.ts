import { Component, OnInit } from '@angular/core';
import { MockAuthService } from '../../../../core/services/mock-auth.service';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';

@Component({
  selector: 'app-stats-cards',
  templateUrl: './stats-cards.component.html',
  styleUrls: ['./stats-cards.component.scss'],
})
export class StatsCardsComponent implements OnInit {
  stats: any[] = [];

  constructor(private authService: MockAuthService) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    const role = this.authService.getUserRole();
    const allStats = [
      {
        label: 'Total Patients',
        value: '1,250',
        icon: 'pi pi-users',
        color: 'green',
        permission: PERMISSIONS.MOD_PATIENTS,
      },
      {
        label: "Today's Appointments",
        value: '45',
        icon: 'pi pi-calendar',
        color: 'orange',
        permission: PERMISSIONS.MOD_APPOINTMENTS,
      },
      {
        label: 'Pending Labs',
        value: '12',
        icon: 'pi pi-flask',
        color: 'purple',
        permission: PERMISSIONS.MOD_LAB,
      },
      {
        label: 'Revenue (Today)',
        value: '$12,500',
        icon: 'pi pi-dollar',
        color: 'green',
        permission: PERMISSIONS.MOD_BILLING,
      },
      {
        label: 'Critical Care',
        value: '8',
        icon: 'pi pi-heart',
        color: 'red',
        permission: PERMISSIONS.MOD_TRIAGE,
      },
    ];

    // Filter stats based on permissions
    this.stats = allStats.filter((stat) =>
      this.authService.hasPermission(stat.permission),
    );
  }
}
