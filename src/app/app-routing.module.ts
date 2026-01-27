import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, PermissionGuard } from './core/guards/guards';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then(
        (m) => m.DashboardModule,
      ),
  },
  {
    path: 'patients',
    loadChildren: () =>
      import('./features/patients/patients.module').then(
        (m) => m.PatientsModule,
      ),
    canActivate: [AuthGuard, PermissionGuard],
    data: { permission: 'MOD_PATIENTS' },
  },
  {
    path: 'appointments',
    loadChildren: () =>
      import('./features/appointments/appointments.module').then(
        (m) => m.AppointmentsModule,
      ),
    canActivate: [AuthGuard, PermissionGuard],
    data: { permission: 'MOD_APPOINTMENTS' },
  },
  {
    path: 'triage',
    loadChildren: () =>
      import('./features/triage/triage.module').then((m) => m.TriageModule),
    canActivate: [AuthGuard, PermissionGuard],
    data: { permission: 'MOD_TRIAGE' },
  },
  {
    path: 'error',
    loadChildren: () =>
      import('./features/error/error.module').then((m) => m.ErrorModule),
  },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/error/not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
