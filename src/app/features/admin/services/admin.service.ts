import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  availability: 'Available' | 'On Leave';
}

export interface ActivityLog {
  id: number;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  user: string;
}

export interface User {
  id: number;
  username: string;
  role: 'ADMIN' | 'DOCTOR' | 'FRONT DESK' | 'BILLING' | 'LAB' | 'NURSE';
  status: 'Active' | 'Disabled';
  email?: string;
  lastActive?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly STORAGE_KEYS = {
    DOCTORS: 'hms_doctors',
    USERS: 'hms_users',
    DASHBOARD: 'hms_dashboard_stats',
  };

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    if (!localStorage.getItem(this.STORAGE_KEYS.DOCTORS)) {
      const mockDoctors: Doctor[] = [
        {
          id: 1,
          name: 'Dr. Smith',
          specialization: 'Cardiology',
          availability: 'Available',
        },
        {
          id: 2,
          name: 'Dr. Jane Doe',
          specialization: 'Pediatrics',
          availability: 'On Leave',
        },
        {
          id: 3,
          name: 'Dr. Emily Stone',
          specialization: 'Neurology',
          availability: 'Available',
        },
      ];
      localStorage.setItem(
        this.STORAGE_KEYS.DOCTORS,
        JSON.stringify(mockDoctors),
      );
    }

    if (!localStorage.getItem(this.STORAGE_KEYS.USERS)) {
      const mockUsers: User[] = [
        { id: 1, username: 'admin', role: 'ADMIN', status: 'Active' },
        { id: 2, username: 'doctor1', role: 'DOCTOR', status: 'Active' },
        { id: 3, username: 'reception', role: 'FRONT DESK', status: 'Active' },
        { id: 4, username: 'billing', role: 'BILLING', status: 'Disabled' },
      ];
      localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
    }
  }

  // Dashboard Stats
  getDashboardStats() {
    // Randomize slightly for "live" feel simply based on rough mock logic or static
    return of({
      totalPatients: 1250,
      todayAppointments: 42,
      totalDoctors: this.getDoctorsSync().length,
      pendingBills: 15,
    });
  }

  // Doctor Management
  getDoctors(): Observable<Doctor[]> {
    return of(this.getDoctorsSync());
  }

  private getDoctorsSync(): Doctor[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.DOCTORS) || '[]');
  }

  addDoctor(doctor: Omit<Doctor, 'id'>): Observable<void> {
    const doctors = this.getDoctorsSync();
    const newDoctor = { ...doctor, id: new Date().getTime() };
    doctors.push(newDoctor);
    localStorage.setItem(this.STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
    return of(undefined);
  }

  updateDoctor(updatedDoctor: Doctor): Observable<void> {
    const doctors = this.getDoctorsSync();
    const index = doctors.findIndex((d) => d.id === updatedDoctor.id);
    if (index !== -1) {
      doctors[index] = updatedDoctor;
      localStorage.setItem(this.STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
    }
    return of(undefined);
  }

  // User Management
  getUsers(): Observable<User[]> {
    return of(this.getUsersSync());
  }

  private getUsersSync(): User[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.USERS) || '[]');
  }

  updateUser(updatedUser: User): Observable<void> {
    const users = this.getUsersSync();
    const index = users.findIndex((u) => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users));
    }
    return of(undefined);
  }

  // Recent Activity
  getRecentActivities(): Observable<ActivityLog[]> {
    return of([
      {
        id: 1,
        message: 'Dr. Smith added new prescription',
        time: '10 mins ago',
        type: 'success',
        user: 'Dr. Smith',
      },
      {
        id: 2,
        message: 'New patient registered: Sarah Jones',
        time: '25 mins ago',
        type: 'info',
        user: 'Reception',
      },
      {
        id: 3,
        message: 'Billing updated for Invoice #A102',
        time: '1 hour ago',
        type: 'warning',
        user: 'Billing Dept',
      },
      {
        id: 4,
        message: 'System backup completed',
        time: '5 hours ago',
        type: 'info',
        user: 'System',
      },
      {
        id: 5,
        message: 'Dr. Emily Stone updated profile',
        time: '1 day ago',
        type: 'info',
        user: 'Dr. Stone',
      },
    ]);
  }
}
