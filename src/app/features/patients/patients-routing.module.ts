import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from '../../core/guards/guards';
import { PatientListComponent } from './components/patient-list/patient-list.component';
// import { PatientRegisterComponent } from './components/patient-register/patient-register.component';
import { PatientViewComponent } from './components/patient-view/patient-view.component';
import { PatientRegisterComponent } from './components/patient-register/patient-register.component';
// import { PatientEditComponent } from './components/patient-edit/patient-edit.component';

const routes: Routes = [
  {
    path: '',
    component: PatientListComponent,
    canActivate: [PermissionGuard],
    data: { permission: 'CMP_PATIENT_LIST' },
  },
  {
    path: 'register',
    component: PatientRegisterComponent,
    canActivate: [PermissionGuard],
    data: { permission: 'CMP_PATIENT_ADD' },
  },
  {
    path: ':id',
    component: PatientViewComponent,
    canActivate: [PermissionGuard],
    data: { permission: 'CMP_PATIENT_VIEW' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientsRoutingModule {}
