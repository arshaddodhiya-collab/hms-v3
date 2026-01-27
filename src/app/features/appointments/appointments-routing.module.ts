import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from '../../core/guards/guards';
import { AppointmentListComponent } from './components/appointment-list/appointment-list.component';
import { AppointmentCreateComponent } from './components/appointment-create/appointment-create.component';
import { AppointmentViewComponent } from './components/appointment-view/appointment-view.component';
import { AppointmentEditComponent } from './components/appointment-edit/appointment-edit.component';

const routes: Routes = [
  {
    path: '',
    component: AppointmentListComponent,
    canActivate: [PermissionGuard],
    data: { permission: 'CMP_APPOINTMENT_LIST' },
  },
  {
    path: 'create',
    component: AppointmentCreateComponent,
    canActivate: [PermissionGuard],
    data: { permission: 'CMP_APPOINTMENT_CREATE' },
  },
  {
    path: 'edit/:id',
    component: AppointmentEditComponent,
    canActivate: [PermissionGuard],
    data: { permission: 'CMP_APPOINTMENT_EDIT' },
  },
  {
    path: ':id',
    component: AppointmentViewComponent,
    canActivate: [PermissionGuard],
    data: { permission: 'CMP_APPOINTMENT_VIEW' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentsRoutingModule {}
