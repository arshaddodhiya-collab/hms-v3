import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: number;
  username: string;
  role: string;
  permissions: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private path = 'auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {
    this.loadCurrentUser();
  }

  // Load user from backend (verifies cookie)
  loadCurrentUser(): void {
    this.apiService
      .get<User>(`${this.path}/me`)
      .pipe(
        catchError((error) => {
          // Silently handle errors during initial load
          // Don't trigger error interceptor redirect for 401/500 on /me endpoint
          this.currentUserSubject.next(null);
          return of(null);
        }),
      )
      .subscribe((user) => {
        if (user) {
          this.currentUserSubject.next(user);
        }
      });
  }

  login(credentials: any): Observable<User> {
    this.loadingSubject.next(true);
    return this.apiService.post<User>(`${this.path}/login`, credentials).pipe(
      tap((user) => {
        this.currentUserSubject.next(user);
        this.loadingSubject.next(false);
      }),
      catchError((error) => {
        this.loadingSubject.next(false);
        throw error;
      }),
    );
  }

  logout(): void {
    this.apiService.post(`${this.path}/logout`, {}).subscribe(() => {
      this.currentUserSubject.next(null);
      this.router.navigate(['/auth/login']);
    });
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUserSubject.value;
    if (!user) return false;
    // Allow if no permission required
    if (!permission) return true;

    return user.permissions.includes(permission);
  }

  getUserRole(): string {
    return this.currentUserSubject.value?.role || '';
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
