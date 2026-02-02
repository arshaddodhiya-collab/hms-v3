import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from '../../core/guards/guards';
import { PERMISSIONS } from '../../core/constants/permissions.constants';
import { UserListComponent } from './components/user-list/user-list.component';

import { DepartmentCreateComponent } from './components/department-create/department-create.component';
import { RolePermissionComponent } from './components/role-permission/role-permission.component';
import { DepartmentListComponent } from './components/department-list/department-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full',
  },
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.CMP_ADMIN_USER_READ },
  },
  {
    path: 'departments',
    component: DepartmentListComponent,
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.CMP_ADMIN_DEPT_READ },
  },
  {
    path: 'roles',
    component: RolePermissionComponent,
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.CMP_ADMIN_ROLE_WRITE },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
