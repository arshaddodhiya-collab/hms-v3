import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-role-permission',
  templateUrl: './role-permission.component.html',
  styleUrls: ['./role-permission.component.scss'],
})
export class RolePermissionComponent implements OnInit {
  roles: any[] = [];
  permissions: any[] = [];
  permissionGroups: { module: string; permissions: any[] }[] = [];

  selectedRole: any = null;
  selectedPermissionIds: Set<number> = new Set();

  loading = false;
  saving = false;

  constructor(
    private adminService: AdminService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.adminService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.loading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load roles',
        });
        this.loading = false;
      },
    });

    this.adminService.getAllPermissions().subscribe({
      next: (perms) => {
        this.permissions = perms;
        this.groupPermissions();
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

  groupPermissions() {
    const groups: { [key: string]: any[] } = {};
    this.permissions.forEach((p) => {
      if (!groups[p.module]) {
        groups[p.module] = [];
      }
      groups[p.module].push(p);
    });

    this.permissionGroups = Object.keys(groups)
      .map((module) => ({
        module,
        permissions: groups[module],
      }))
      .sort((a, b) => a.module.localeCompare(b.module));
  }

  onRoleSelect(event: any) {
    this.selectedRole = event.value;
    this.selectedPermissionIds.clear();

    if (this.selectedRole && this.selectedRole.permissions) {
      this.selectedRole.permissions.forEach((p: any) => {
        this.selectedPermissionIds.add(p.id);
      });
    }
  }

  isPermissionSelected(permId: number): boolean {
    return this.selectedPermissionIds.has(permId);
  }

  togglePermission(permId: number) {
    if (this.selectedPermissionIds.has(permId)) {
      this.selectedPermissionIds.delete(permId);
    } else {
      this.selectedPermissionIds.add(permId);
    }
  }

  save() {
    if (!this.selectedRole) return;

    this.saving = true;
    const permissionIds = Array.from(this.selectedPermissionIds);

    this.adminService
      .updateRolePermissions(this.selectedRole.id, permissionIds)
      .subscribe({
        next: (updatedRole) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Permissions updated successfully',
          });
          // Update local role data
          const index = this.roles.findIndex((r) => r.id === updatedRole.id);
          if (index !== -1) {
            this.roles[index] = updatedRole;
            this.selectedRole = updatedRole; // Re-select to ensure consistency
          }
          this.saving = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update permissions',
          });
          this.saving = false;
        },
      });
  }
}
