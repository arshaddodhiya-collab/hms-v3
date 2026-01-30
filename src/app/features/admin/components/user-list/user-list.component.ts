import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { MockUser } from '../../../../core/config/mock-users.config';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  users: MockUser[] = [];
  permissions = PERMISSIONS;
  displayDialog = false;
  selectedUser: MockUser | null = null;
  dialogHeader = 'Create User';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.refreshUsers();
  }

  refreshUsers() {
    this.adminService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }

  createUser(): void {
    this.selectedUser = null;
    this.dialogHeader = 'Create User';
    this.displayDialog = true;
  }

  editUser(user: MockUser): void {
    this.selectedUser = user;
    this.dialogHeader = 'Edit User';
    this.displayDialog = true;
  }

  onSave(user: MockUser) {
    // In a real app we'd determine if create or update based on ID
    // Here, check if we're editing
    if (this.selectedUser) {
      // Update logic (MockService usually doesn't simulate full update well without IDs, but we'll try)
      // For simplicity in this mock, we'll just log or trigger a "refresh"
      console.log('Updating user', user);
    } else {
      // Create logic
      console.log('Creating user', user);
      // Not fully implemented in MockService for users yet, but simulating flow
    }
    this.displayDialog = false;
    this.refreshUsers();
  }

  onCancel() {
    this.displayDialog = false;
  }
}
