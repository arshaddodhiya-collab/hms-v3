import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
  username: string;
  role: 'DOCTOR' | 'ADMIN' | 'FRONT DESK' | 'NURSE' | 'BILLING' | 'LAB';
  token?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly MOCK_USERS: Record<string, User & { password: string }> = {
    doctor: { username: 'doctor', password: 'doctor', role: 'DOCTOR' },
    admin: { username: 'admin', password: 'admin', role: 'ADMIN' },
    receptionist: {
      username: 'receptionist',
      password: 'receptionist',
      role: 'FRONT DESK',
    },
    nurse: { username: 'nurse', password: 'nurse', role: 'NURSE' },
    billing: { username: 'billing', password: 'billing', role: 'BILLING' },
    lab: { username: 'lab', password: 'lab', role: 'LAB' },
  };

  private readonly TOKEN_KEY = 'access_token';

  constructor(private router: Router) {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      const user = this.decodeToken(token);
      if (user) {
        this.currentUserSubject.next({ ...user, token });
      } else {
        this.logout(); // Invalid token
      }
    }
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  login(username: string, password: string): Observable<boolean> {
    const user = this.MOCK_USERS[username];

    if (user && user.password === password) {
      // Create a user object without password for the state/token
      const { password: _, ...userInfo } = user;
      const token = this.generateMockJwt(userInfo);

      return of(true).pipe(
        delay(500),
        tap(() => {
          localStorage.setItem(this.TOKEN_KEY, token);
          this.currentUserSubject.next({ ...userInfo, token });
        }),
      );
    }
    return throwError(() => new Error('Invalid username or password'));
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.role === role : false;
  }

  getRole(): string | null {
    const user = this.currentUserSubject.value;
    return user ? user.role : null;
  }

  // Helper to determine where to redirect after login based on role
  getRedirectUrl(): string {
    const role = this.currentUserValue?.role;
    switch (role) {
      case 'ADMIN':
        return '/admin';
      case 'FRONT DESK':
        return '/reception';
      case 'DOCTOR':
        return '/doctor';
      case 'NURSE':
        return '/nurse';
      case 'BILLING':
        return '/billing';
      case 'LAB':
        return '/lab';
      default:
        return '/';
    }
  }

  private generateMockJwt(user: User): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        sub: user.username,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
      }),
    );
    const signature = 'mockSignature';
    return `${header}.${payload}.${signature}`;
  }

  private decodeToken(token: string): User | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        return null;
      }

      return {
        username: payload.sub,
        role: payload.role,
      };
    } catch (e) {
      return null;
    }
  }
}
