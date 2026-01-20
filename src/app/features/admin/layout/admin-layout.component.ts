import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent {
  sidebarVisible = false;

  menuItems = [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/admin/dashboard' },
    { label: 'Doctors', icon: 'pi pi-user-plus', route: '/admin/doctors' },
    { label: 'Users', icon: 'pi pi-users', route: '/admin/users' },
  ];

  constructor(
    private authService: AuthService,
    public router: Router,
  ) {}

  logout() {
    this.authService.logout();
  }
}
