import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { DepartmentListComponent } from './components/department-list/department-list.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { RolePermissionComponent } from './components/role-permission/role-permission.component';
import { DepartmentCreateComponent } from './components/department-create/department-create.component';
import { UserCreateComponent } from './components/user-create/user-create.component';

@NgModule({
  declarations: [
    DepartmentListComponent,
    UserListComponent,
    RolePermissionComponent,
    DepartmentCreateComponent,
    UserCreateComponent,
  ],
  imports: [CommonModule, SharedModule, AdminRoutingModule],
})
export class AdminModule {}
