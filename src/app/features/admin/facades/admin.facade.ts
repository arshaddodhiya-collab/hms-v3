import { Injectable, signal } from '@angular/core';
import { MessageService } from 'primeng/api';

import { BaseFacade } from '../../../core/facades/base-facade';
import { AdminService } from '../services/admin.service';
import { Department } from '../../../core/models/department.model';
import { User } from '../../../core/models/user.model';

/**
 * AdminFacade — Central state management for the Admin module.
 * Manages departments, users, roles & permissions.
 */
@Injectable({
  providedIn: 'root',
})
export class AdminFacade extends BaseFacade<Department> {
  // --- Signals ---
  readonly departments = signal<Department[]>([]);
  readonly users = signal<User[]>([]);
  readonly roles = signal<any[]>([]);
  readonly permissions = signal<any[]>([]);
  readonly saving = signal(false);

  constructor(
    private adminService: AdminService,
    private messageService: MessageService,
  ) {
    super();
  }

  // ==============================
  //  ACTIONS
  // ==============================

  override load(): void {
    this.loadDepartments();
  }

  // --- Departments ---

  loadDepartments(): void {
    this.loading.set(true);
    this.error.set(null);

    this.adminService.getDepartments().subscribe({
      next: (data) => {
        this.departments.set(data);
        this.data.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load departments',
        });
      },
    });
  }

  addDepartment(dept: Department, onSuccess: () => void): void {
    this.saving.set(true);
    this.adminService.addDepartment(dept).subscribe({
      next: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Created',
          detail: 'Department created successfully.',
        });
        this.loadDepartments();
        onSuccess();
      },
      error: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create department',
        });
      },
    });
  }

  updateDepartment(dept: Department, onSuccess: () => void): void {
    this.saving.set(true);
    this.adminService.updateDepartment(dept).subscribe({
      next: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Department updated successfully.',
        });
        this.loadDepartments();
        onSuccess();
      },
      error: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update department',
        });
      },
    });
  }

  deleteDepartment(id: number): void {
    this.saving.set(true);
    this.adminService.deleteDepartment(id).subscribe({
      next: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Department deleted successfully.',
        });
        this.loadDepartments();
      },
      error: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete department',
        });
      },
    });
  }

  // --- Users ---

  loadUsers(): void {
    this.loading.set(true);
    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load users',
        });
      },
    });
  }

  createUser(user: User, onSuccess: () => void): void {
    this.saving.set(true);
    this.adminService.createUser(user).subscribe({
      next: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Created',
          detail: 'User created successfully.',
        });
        this.loadUsers();
        onSuccess();
      },
      error: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create user',
        });
      },
    });
  }

  updateUser(id: number, user: User, onSuccess: () => void): void {
    this.saving.set(true);
    this.adminService.updateUser(id, user).subscribe({
      next: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'User updated successfully.',
        });
        this.loadUsers();
        onSuccess();
      },
      error: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update user',
        });
      },
    });
  }

  // --- Roles & Permissions ---

  loadRoles(): void {
    this.loading.set(true);
    this.adminService.getRoles().subscribe({
      next: (data) => {
        this.roles.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load roles',
        });
      },
    });
  }

  loadPermissions(): void {
    this.adminService.getAllPermissions().subscribe({
      next: (data) => {
        this.permissions.set(data);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load permissions',
        });
      },
    });
  }

  updateRolePermissions(
    roleId: number,
    permissionIds: number[],
    onSuccess: (updatedRole: any) => void,
  ): void {
    this.saving.set(true);
    this.adminService.updateRolePermissions(roleId, permissionIds).subscribe({
      next: (updatedRole) => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Permissions updated successfully',
        });
        onSuccess(updatedRole);
      },
      error: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update permissions',
        });
      },
    });
  }
}
