import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MOCK_USERS, MockUser } from '../config/mock-users.config';

@Injectable({
  providedIn: 'root',
})
export class MockAuthService {
  private currentUserSubject = new BehaviorSubject<MockUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) {
    const savedUser = localStorage.getItem('hms_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      // Refresh user data from config to get latest permissions
      const configUser = MOCK_USERS.find((u) => u.username === user.username);

      if (configUser) {
        this.currentUserSubject.next(configUser);
        // Update local storage with fresh data
        localStorage.setItem('hms_user', JSON.stringify(configUser));
      } else {
        // Fallback if user no longer exists in config
        this.currentUserSubject.next(user);
      }
    }
  }

  login(username: string, password: string): boolean {
    const user = MOCK_USERS.find(
      (u) => u.username === username && u.password === password,
    );

    if (user) {
      this.currentUserSubject.next(user);
      localStorage.setItem('hms_user', JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout() {
    this.currentUserSubject.next(null);
    localStorage.removeItem('hms_user');
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUserSubject.value;
    if (!user) return false;
    if (!permission) return true;
    return user.permissions.includes(permission);
  }

  getUserRole(): string {
    return this.currentUserSubject.value?.role || '';
  }

  getCurrentUser(): MockUser | null {
    return this.currentUserSubject.value;
  }
}
