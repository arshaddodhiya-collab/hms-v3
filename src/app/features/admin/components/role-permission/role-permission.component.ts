import { Component, OnInit, effect } from '@angular/core';
import { AdminFacade } from '../../facades/admin.facade';
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

  constructor(private adminFacade: AdminFacade) {
    effect(() => {
      this.roles = this.adminFacade.roles();
      this.loading = false;
    });
    effect(() => {
      this.permissions = this.adminFacade.permissions();
      this.groupPermissions();
    });
    effect(() => {
      this.saving = this.adminFacade.saving();
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.adminFacade.loadRoles();
    this.adminFacade.loadPermissions();
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

    const permissionIds = Array.from(this.selectedPermissionIds);

    this.adminFacade.updateRolePermissions(
      this.selectedRole.id,
      permissionIds,
      (updatedRole: any) => {
        // Update local role data
        const index = this.roles.findIndex((r) => r.id === updatedRole.id);
        if (index !== -1) {
          this.roles[index] = updatedRole;
          this.selectedRole = updatedRole; // Re-select to ensure consistency
        }
      },
    );
  }
}
