import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';
import { DashboardFacade } from '../../facades/dashboard.facade';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  permissions = PERMISSIONS;

  constructor(public facade: DashboardFacade) {}

  ngOnInit() {
    this.facade.loadDashboard();
  }

  onLogout() {
    this.facade.logout();
  }
}
