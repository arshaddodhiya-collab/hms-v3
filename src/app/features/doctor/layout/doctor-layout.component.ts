import { Component } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-doctor-layout',
  template: `
    <app-main-layout
      [menuItems]="menuItems"
      appTitle="HMS Doctor"
      userRole="Doctor"
    >
      <router-outlet></router-outlet>
    </app-main-layout>
  `,
})
export class DoctorLayoutComponent {
  menuItems: any[] = [];

  constructor(private authService: AuthService) {
    this.menuItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        route: '/doctor/dashboard',
      },
      {
        label: 'My Schedule',
        icon: 'pi pi-calendar',
        route: '/doctor/schedule',
      },
      {
        label: 'Patient Records',
        icon: 'pi pi-folder',
        route: '/doctor/patients',
      },
    ];
  }

  logout() {
    this.authService.logout();
  }
}
