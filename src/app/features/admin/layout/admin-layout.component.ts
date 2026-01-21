import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent {
  menuItems = [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/admin/dashboard' },
    { label: 'Doctors', icon: 'pi pi-user-plus', route: '/admin/doctors' },
    { label: 'Users', icon: 'pi pi-users', route: '/admin/users' },
  ];
}
