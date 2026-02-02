import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { VitalsEntryComponent } from './components/vitals-entry/vitals-entry.component';
import { TriageListComponent } from './components/triage-list/triage-list.component';
import { TriageRoutingModule } from './triage-routing.module';
import { VitalsSharedModule } from './vitals-shared.module';

@NgModule({
  declarations: [VitalsEntryComponent, TriageListComponent],
  imports: [SharedModule, TriageRoutingModule, VitalsSharedModule],
  exports: [],
})
export class TriageModule {}
