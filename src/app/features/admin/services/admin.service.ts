import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../../../core/models/department.model';
import { User } from '../../../core/models/user.model';
import { environment } from '../../../../environments/environment';
// import { MockUser } from '../../../core/config/mock-users.config'; // Keep for legacy if needed, but prefer User

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Departments
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/departments`);
  }

  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/departments/${id}`);
  }

  addDepartment(dept: Department): Observable<Department> {
    return this.http.post<Department>(`${this.apiUrl}/departments`, dept);
  }

  updateDepartment(dept: Department): Observable<Department> {
    return this.http.put<Department>(
      `${this.apiUrl}/departments/${dept.id}`,
      dept,
    );
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/departments/${id}`);
  }

  // Users (Assuming we have user endpoints, if not we'll need to add them to backend)
  // For now, let's keep the MockUser type but fetch from backend if possible,
  // or just use what we have if backend user management isn't fully ready for this service.
  // Based on the plan, we should fetch users.

  // Users
  // Users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, user);
  }
}
