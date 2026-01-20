import { Component, OnInit } from '@angular/core';
import { AdminService, User } from '../services/admin.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  roles: any[] = [];
  userStatusHelper: { [key: number]: boolean } = {};

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.roles = [
      { label: 'ADMIN', value: 'ADMIN' },
      { label: 'DOCTOR', value: 'DOCTOR' },
      { label: 'FRONT DESK', value: 'FRONT DESK' },
      { label: 'BILLING', value: 'BILLING' },
      { label: 'LAB', value: 'LAB' },
      { label: 'NURSE', value: 'NURSE' },
    ];
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.getUsers().subscribe((data) => {
      this.users = data;
      this.users.forEach((u) => {
        this.userStatusHelper[u.id] = u.status === 'Active';
      });
    });
  }

  onRoleChange(user: User) {
    this.adminService.updateUser(user).subscribe();
  }

  onStatusMapChange(user: User, event: any) {
    const newStatus = event.checked ? 'Active' : 'Disabled';
    const updatedUser = { ...user, status: newStatus as 'Active' | 'Disabled' };

    // Optimistic update locally
    user.status = newStatus as 'Active' | 'Disabled';

    this.adminService.updateUser(updatedUser).subscribe();
  }
}
