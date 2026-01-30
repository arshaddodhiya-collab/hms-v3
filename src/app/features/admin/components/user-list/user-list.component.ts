import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { MockUser } from '../../../../core/config/mock-users.config';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, AfterViewInit {
  @ViewChild('roleTemplate') roleTemplate!: TemplateRef<any>;

  users: MockUser[] = [];
  permissions = PERMISSIONS;
  displayDialog = false;
  selectedUser: MockUser | null = null;
  dialogHeader = 'Create User';

  cols: any[] = [
    { field: 'username', header: 'Username' },
    { field: 'role', header: 'Role' },
  ];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.refreshUsers();
  }

  ngAfterViewInit() {
    // Assign the template to the column config
    // We need to trigger change detection or just ensure it's picked up.
    // Since cols is an input, mutating it might not trigger OnChanges in child if generic check.
    // But typically object reference mutation works if OnPush isn't used strictly or if we re-assign.

    const roleCol = this.cols.find((c) => c.field === 'role');
    if (roleCol) {
      roleCol.template = this.roleTemplate;
    }
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
    if (this.selectedUser) {
      console.log('Updating user', user);
    } else {
      console.log('Creating user', user);
    }
    this.displayDialog = false;
    this.refreshUsers();
  }

  onCancel() {
    this.displayDialog = false;
  }
}
