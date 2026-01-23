import { Injectable } from '@angular/core';
import { PERMISSIONS } from '../constants/permissions.constants';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MockAuthService {
  private isLoggedIn = true; // Simulating logged in state

  // Simulating a "Doctor" role access for now, can be changed to test others
  private userPermissions = [
    PERMISSIONS.MOD_DASHBOARD,
    PERMISSIONS.MOD_PATIENTS,
    PERMISSIONS.MOD_APPOINTMENTS,
    PERMISSIONS.MOD_CONSULTATION,
    PERMISSIONS.ACT_VIEW,
    PERMISSIONS.ACT_CREATE,
  ];

  login() {
    this.isLoggedIn = true;
  }

  logout() {
    this.isLoggedIn = false;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  hasPermission(permission: string): boolean {
    if (!permission) return true;
    return this.userPermissions.includes(permission);
  }

  getUserPermissions() {
    return of(this.userPermissions);
  }
}
