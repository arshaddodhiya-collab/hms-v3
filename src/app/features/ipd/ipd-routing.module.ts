import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmissionListComponent } from './components/admission-list/admission-list.component';
import { BedManagementComponent } from './components/bed-management/bed-management.component';
import { AdmissionFormComponent } from './components/admission-form/admission-form.component';
import { DischargeSummaryComponent } from './components/discharge-summary/discharge-summary.component';

const routes: Routes = [
  { path: '', redirectTo: 'admissions', pathMatch: 'full' },
  { path: 'admissions', component: AdmissionListComponent },
  { path: 'beds', component: BedManagementComponent },
  { path: 'admit', component: AdmissionFormComponent },
  { path: 'discharge/:admissionId', component: DischargeSummaryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IpdRoutingModule {}
