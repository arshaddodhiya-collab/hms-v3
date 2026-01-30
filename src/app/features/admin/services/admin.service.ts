import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MOCK_USERS, MockUser } from '../../../core/config/mock-users.config';

export interface Department {
  id: string;
  name: string;
  head: string;
  staffCount: number;
}

const MOCK_DEPTS: Department[] = [
  { id: 'DEPT-001', name: 'Cardiology', head: 'Dr. Smith', staffCount: 12 },
  { id: 'DEPT-002', name: 'Neurology', head: 'Dr. Jones', staffCount: 8 },
  { id: 'DEPT-003', name: 'Pediatrics', head: 'Dr. Brown', staffCount: 15 },
  { id: 'DEPT-004', name: 'Orthopedics', head: 'Dr. White', staffCount: 10 },
];

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private departments$ = new BehaviorSubject<Department[]>(MOCK_DEPTS);
  private users$ = new BehaviorSubject<MockUser[]>(MOCK_USERS);

  constructor() {}

  // Departments
  getDepartments(): Observable<Department[]> {
    return this.departments$.asObservable().pipe(delay(500));
  }

  getDepartmentById(id: string): Department | undefined {
    return this.departments$.value.find((d) => d.id === id);
  }

  addDepartment(dept: Department): void {
    const current = this.departments$.value;
    this.departments$.next([...current, dept]);
  }

  updateDepartment(dept: Department): void {
    const current = this.departments$.value;
    const index = current.findIndex((d) => d.id === dept.id);
    if (index !== -1) {
      current[index] = dept;
      this.departments$.next([...current]);
    }
  }

  deleteDepartment(id: string): void {
    const current = this.departments$.value;
    this.departments$.next(current.filter((d) => d.id !== id));
  }

  // Users
  getUsers(): Observable<MockUser[]> {
    return this.users$.asObservable().pipe(delay(500));
  }
}
