import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['/auth/login']);
    return false;
  }
}

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredPermission = route.data['permission'];

    // Allow if no permission required
    if (!requiredPermission) {
      return true;
    }

    const hasPerm = this.authService.hasPermission(requiredPermission);

    if (hasPerm) {
      return true;
    }

    // Redirect to unauthorized or dashboard if no permission
    console.warn('Access denied. Missing permission:', requiredPermission);
    this.messageService.add({
      severity: 'error',
      summary: 'Access Denied',
      detail: 'You do not have permission to access this resource',
    });
    // Optional: Redirect to a specific error page or just false
    // this.router.navigate(['/dashboard']);
    return false;
  }
}
