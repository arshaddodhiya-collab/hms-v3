import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IpdRoutingModule } from './ipd-routing.module';
import { AdmissionListComponent } from './components/admission-list/admission-list.component';
import { BedManagementComponent } from './components/bed-management/bed-management.component';

import { SharedModule } from '../../shared/shared.module';
import { AdmissionFormComponent } from './components/admission-form/admission-form.component';

@NgModule({
  declarations: [AdmissionListComponent, BedManagementComponent, AdmissionFormComponent],
  imports: [CommonModule, IpdRoutingModule, SharedModule],
})
export class IpdModule {}
