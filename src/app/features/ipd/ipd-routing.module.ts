import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmissionListComponent } from './components/admission-list/admission-list.component';
import { BedManagementComponent } from './components/bed-management/bed-management.component';

const routes: Routes = [
  { path: '', redirectTo: 'admissions', pathMatch: 'full' },
  { path: 'admissions', component: AdmissionListComponent },
  { path: 'beds', component: BedManagementComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IpdRoutingModule {}
