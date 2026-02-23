import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { User } from '../../../../core/models/user.model';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';
import { BaseCrudComponent } from '../../../../shared/components/base-crud.component';
import { TableColumn } from '../../../../shared/models/table.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent
  extends BaseCrudComponent<User>
  implements OnInit, AfterViewInit
{
  @ViewChild('roleTemplate') roleTemplate!: TemplateRef<{
    $implicit: unknown;
    row: User;
  }>;

  permissions = PERMISSIONS;

  cols: TableColumn<User>[] = [
    { field: 'username', header: 'Username' },
    { field: 'fullName', header: 'Full Name' },
    { field: 'departmentName', header: 'Department' },
    { field: 'roles', header: 'Roles' },
    { field: 'active', header: 'Active' },
  ];

  constructor(private adminService: AdminService) {
    super();
  }

  override ngOnInit(): void {
    this.refreshData();
  }

  ngAfterViewInit() {
    const roleCol = this.cols.find((c) => c.field === 'roles');
    if (roleCol) {
      roleCol.template = this.roleTemplate;
    }
  }

  override refreshData() {
    this.adminService.getUsers().subscribe((data: User[]) => {
      this.data = data;
    });
  }

  override onSave(user: User) {
    if (this.selectedItem && this.selectedItem.id) {
      this.adminService.updateUser(this.selectedItem.id, user).subscribe(() => {
        this.hideDialog();
        this.refreshData();
      });
    } else {
      this.adminService.createUser(user).subscribe(() => {
        this.hideDialog();
        this.refreshData();
      });
    }
  }
}
