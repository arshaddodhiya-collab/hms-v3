import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PermissionGuard } from '../../core/guards/guards';
import { ConsultationListComponent } from './components/consultation-list/consultation-list.component';
import { ConsultationDetailComponent } from './components/consultation-detail/consultation-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ConsultationListComponent,
    canActivate: [PermissionGuard],
    data: { permission: 'MOD_CONSULTATION' },
  },
  {
    path: ':encounterId',
    component: ConsultationDetailComponent,
    canActivate: [PermissionGuard],
    data: { permission: 'CMP_CONSULTATION_WRITE' },
  },
  {
    path: 'by-appointment/:appointmentId',
    component: ConsultationDetailComponent,
    canActivate: [PermissionGuard],
    data: { permission: 'CMP_CONSULTATION_WRITE' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultationRoutingModule {}
