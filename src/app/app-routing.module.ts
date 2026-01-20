import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { roleGuard } from './auth/role.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () =>
      import('./features/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.module').then((m) => m.AdminModule),
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' },
  },
  // {
  //   path: 'reception',
  //   loadChildren: () =>
  //     import('./features/front-desk/front-desk.module').then(
  //       (m) => m.FrontDeskModule,
  //     ),
  //   canActivate: [authGuard, roleGuard],
  //   data: { role: 'FRONT DESK' },
  // },
  {
    path: 'doctor',
    loadChildren: () =>
      import('./features/doctor/doctor.module').then((m) => m.DoctorModule),
    canActivate: [authGuard, roleGuard],
    data: { role: 'DOCTOR' },
  },
  {
    path: 'nurse',
    loadChildren: () =>
      import('./features/nurse/nurse.module').then((m) => m.NurseModule),
    canActivate: [authGuard, roleGuard],
    data: { role: 'NURSE' },
  },
  // {
  //   path: 'billing',
  //   loadChildren: () =>
  //     import('./features/billing/billing.module').then((m) => m.BillingModule),
  //   canActivate: [authGuard, roleGuard],
  //   data: { role: 'BILLING' },
  // },
  {
    path: 'lab',
    loadChildren: () =>
      import('./features/lab/lab.module').then((m) => m.LabModule),
    canActivate: [authGuard, roleGuard],
    data: { role: 'LAB' },
  },
  // Fallback
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
