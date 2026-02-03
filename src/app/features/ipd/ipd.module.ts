import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IpdRoutingModule } from './ipd-routing.module';
import { AdmissionListComponent } from './components/admission-list/admission-list.component';
import { BedManagementComponent } from './components/bed-management/bed-management.component';

import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [AdmissionListComponent, BedManagementComponent],
  imports: [CommonModule, IpdRoutingModule, SharedModule],
})
export class IpdModule {}
