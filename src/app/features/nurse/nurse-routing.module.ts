import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NurseLayoutComponent } from './layout/nurse-layout.component';
import { NurseDashboardComponent } from './dashboard/nurse-dashboard.component';
import { VitalsComponent } from './vitals/vitals.component';
import { BedManagementComponent } from './bed-management/bed-management.component';
import { MedicationAdminComponent } from './medication/medication-admin.component';

const routes: Routes = [
  {
    path: '',
    component: NurseLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: NurseDashboardComponent },
      { path: 'vitals', component: VitalsComponent },
      { path: 'beds', component: BedManagementComponent },
      { path: 'medication', component: MedicationAdminComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NurseRoutingModule {}
