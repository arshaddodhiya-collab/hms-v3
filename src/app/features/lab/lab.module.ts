import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { LabRequestListComponent } from './components/lab-request-list/lab-request-list.component';
import { LabRoutingModule } from './lab-routing.module';
import { LabTestEntryComponent } from './components/lab-test-entry/lab-test-entry.component';
import { LabReportViewComponent } from './components/lab-report-view/lab-report-view.component';
import { TestRequestComponent } from './components/test-request/test-request.component';

@NgModule({
  declarations: [
    LabRequestListComponent,
    LabTestEntryComponent,
    LabReportViewComponent,
    TestRequestComponent,
  ],
  imports: [CommonModule, LabRoutingModule, SharedModule],
})
export class LabModule {}
