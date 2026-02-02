import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { MockAuthService } from '../services/mock-auth.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: MockAuthService,
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
    private authService: MockAuthService,
    private router: Router,
    private messageService: MessageService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredPermission = route.data['permission'];
    console.log('PermissionGuard Checking:', {
      requiredPermission,
      url: (route as any)._routerState?.url,
    });
    if (!requiredPermission) {
      return true;
    }
    const hasPerm = this.authService.hasPermission(requiredPermission);
    console.log('PermissionGuard Result:', hasPerm, requiredPermission);

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
    this.router.navigate(['/error/unauthorized']);
    return false;
  }
}
