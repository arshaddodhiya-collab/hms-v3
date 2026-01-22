import { Component } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-nurse-layout',
  template: `
    <app-main-layout
      [menuItems]="menuItems"
      appTitle="HMS Nurse"
      userRole="Nurse"
    >
      <router-outlet></router-outlet>
    </app-main-layout>
  `,
})
export class NurseLayoutComponent {
  menuItems: any[] = [];

  constructor(private authService: AuthService) {
    this.menuItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        route: '/nurse/dashboard',
      },
      {
        label: 'Vitals',
        icon: 'pi pi-heart',
        route: '/nurse/vitals',
      },
      {
        label: 'Bed Management',
        icon: 'pi pi-inbox', // or pi-table
        route: '/nurse/beds',
      },
      {
        label: 'Medication',
        icon: 'pi pi-briefcase', // or pi-capsule if available, but briefcase is safe
        route: '/nurse/medication',
      },
    ];
  }

  logout() {
    this.authService.logout();
  }
}
