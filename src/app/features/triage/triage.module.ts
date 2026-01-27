import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { VitalsEntryComponent } from './components/vitals-entry/vitals-entry.component';
import { VitalsViewComponent } from './components/vitals-view/vitals-view.component';
import { TriageListComponent } from './components/triage-list/triage-list.component';
import { TriageRoutingModule } from './triage-routing.module';

@NgModule({
  declarations: [
    VitalsEntryComponent,
    VitalsViewComponent,
    TriageListComponent,
  ],
  imports: [SharedModule, TriageRoutingModule],
})
export class TriageModule {}
