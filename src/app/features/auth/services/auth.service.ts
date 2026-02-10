import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

export interface User {
  username: string;
  role: string;
  permissions: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.loadCurrentUser();
  }

  // Load user from backend (verifies cookie)
  loadCurrentUser(): void {
    this.http
      .get<User>(`${this.apiUrl}/me`, { withCredentials: true })
      .pipe(
        catchError(() => {
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
    return this.http
      .post<User>(`${this.apiUrl}/login`, credentials, {
        withCredentials: true,
      })
      .pipe(
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
    this.http
      .post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .subscribe(() => {
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
