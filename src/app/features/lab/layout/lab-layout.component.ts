import { Component } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-lab-layout',
  template: `
    <app-main-layout [menuItems]="menuItems" appTitle="HMS Lab" userRole="Lab">
      <router-outlet></router-outlet>
    </app-main-layout>
  `,
})
export class LabLayoutComponent {
  menuItems: any[] = [];

  constructor(private authService: AuthService) {
    this.menuItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        route: '/lab/dashboard',
      },
      {
        label: 'Test Requests',
        icon: 'pi pi-list',
        route: '/lab/requests',
      },
      {
        label: 'Reports',
        icon: 'pi pi-file',
        route: '/lab/reports',
      },
    ];
  }

  logout() {
    this.authService.logout();
  }
}
