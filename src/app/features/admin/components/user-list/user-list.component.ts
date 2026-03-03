import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  effect,
} from '@angular/core';
import { AdminFacade } from '../../facades/admin.facade';
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

  constructor(private adminFacade: AdminFacade) {
    super();
    effect(() => {
      this.data = this.adminFacade.users();
    });
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
    this.adminFacade.loadUsers();
  }

  override onSave(user: User) {
    if (this.selectedItem && this.selectedItem.id) {
      this.adminFacade.updateUser(this.selectedItem.id, user, () => {
        this.hideDialog();
      });
    } else {
      this.adminFacade.createUser(user, () => {
        this.hideDialog();
      });
    }
  }
}
