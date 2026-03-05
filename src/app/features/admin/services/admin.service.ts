import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Department } from '../../../core/models/department.model';
import { User } from '../../../core/models/user.model';
import { ApiService } from '../../../core/services/api.service';
// import { MockUser } from '../../../core/config/mock-users.config'; // Keep for legacy if needed, but prefer User

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private apiService: ApiService) {}

  // Departments
  getDepartments(): Observable<Department[]> {
    const params = new HttpParams().set('size', '100');
    return this.apiService
      .get<any>(`departments`, params)
      .pipe(map((res) => res.content || res));
  }

  getDepartmentById(id: number): Observable<Department> {
    return this.apiService.get<Department>(`departments/${id}`);
  }

  addDepartment(dept: Department): Observable<Department> {
    return this.apiService.post<Department>(`departments`, dept);
  }

  updateDepartment(dept: Department): Observable<Department> {
    return this.apiService.put<Department>(`departments/${dept.id}`, dept);
  }

  deleteDepartment(id: number): Observable<void> {
    return this.apiService.delete<void>(`departments/${id}`);
  }

  // Users (Assuming we have user endpoints, if not we'll need to add them to backend)
  // For now, let's keep the MockUser type but fetch from backend if possible,
  // or just use what we have if backend user management isn't fully ready for this service.
  // Based on the plan, we should fetch users.

  // Users
  // Users
  getUsers(): Observable<User[]> {
    const params = new HttpParams().set('size', '100');
    return this.apiService
      .get<any>(`users`, params)
      .pipe(map((res) => res.content || res));
  }

  getUserById(id: number): Observable<User> {
    return this.apiService.get<User>(`users/${id}`);
  }

  createUser(user: User): Observable<User> {
    return this.apiService.post<User>(`users`, user);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.apiService.put<User>(`users/${id}`, user);
  }

  // Roles & Permissions
  getRoles(): Observable<any[]> {
    const params = new HttpParams().set('size', '100');
    return this.apiService
      .get<any>(`roles`, params)
      .pipe(map((res) => res.content || res));
  }

  getAllPermissions(): Observable<any[]> {
    const params = new HttpParams().set('size', '100');
    return this.apiService
      .get<any>(`roles/permissions`, params)
      .pipe(map((res) => res.content || res));
  }

  updateRolePermissions(
    roleId: number,
    permissionIds: number[],
  ): Observable<any> {
    return this.apiService.put(`roles/${roleId}/permissions`, permissionIds);
  }
}
