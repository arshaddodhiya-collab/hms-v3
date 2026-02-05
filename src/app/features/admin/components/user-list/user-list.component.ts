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
import { BaseCrudComponent } from '../../../../shared/components/base-crud.component';
import { TableColumn } from '../../../../shared/models/table.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent
  extends BaseCrudComponent<MockUser>
  implements OnInit, AfterViewInit
{
  @ViewChild('roleTemplate') roleTemplate!: TemplateRef<{
    $implicit: unknown;
    row: MockUser;
  }>;

  permissions = PERMISSIONS;

  cols: TableColumn<MockUser>[] = [
    { field: 'username', header: 'Username' },
    { field: 'role', header: 'Role' },
  ];

  constructor(private adminService: AdminService) {
    super();
  }

  override ngOnInit(): void {
    this.refreshData();
  }

  ngAfterViewInit() {
    const roleCol = this.cols.find((c) => c.field === 'role');
    if (roleCol) {
      roleCol.template = this.roleTemplate;
    }
  }

  override refreshData() {
    this.adminService.getUsers().subscribe((data) => {
      this.data = data;
    });
  }

  override onSave(user: MockUser) {
    if (this.selectedItem) {
      console.log('Updating user', user);
    } else {
      console.log('Creating user', user);
    }
    this.hideDialog();
    this.refreshData();
  }
}
