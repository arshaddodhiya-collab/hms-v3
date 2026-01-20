import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  const expectedRole = route.data['role'];

  if (authService.hasRole(expectedRole)) {
    return true;
  }

  // Determine where to redirect if role mismatch, or just go to a generic "unauthorized" or home
  // For now, let's redirect to their proper dashboard if we can infer it, or just login
  // Determine where to redirect if role mismatch
  const redirectUrl = authService.getRedirectUrl();
  if (redirectUrl && redirectUrl !== '/') {
    return router.createUrlTree([redirectUrl]);
  }

  // improved fallback
  return router.createUrlTree(['/login']);
};
