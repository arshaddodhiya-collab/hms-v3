import { Component } from '@angular/core';

@Component({
  selector: 'app-front-desk-layout',
  templateUrl: './front-desk-layout.component.html',
  styleUrls: ['./front-desk-layout.component.scss'],
})
export class FrontDeskLayoutComponent {
  menuItems = [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/reception/dashboard' },
    {
      label: 'Register Patient',
      icon: 'pi pi-user-plus',
      route: '/reception/register',
    },
    {
      label: 'Appointments',
      icon: 'pi pi-calendar',
      route: '/reception/appointments',
    },
    { label: 'Billing', icon: 'pi pi-wallet', route: '/billing' },
    { label: 'Lab Tests', icon: 'pi pi-box', route: '/lab' },
  ];
}
