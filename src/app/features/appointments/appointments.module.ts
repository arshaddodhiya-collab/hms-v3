import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineModule } from 'primeng/timeline';
import { SharedModule } from '../../shared/shared.module';
import { AppointmentsRoutingModule } from './appointments-routing.module';
import { AppointmentListComponent } from './components/appointment-list/appointment-list.component';
import { AppointmentCreateComponent } from './components/appointment-create/appointment-create.component';
import { AppointmentViewComponent } from './components/appointment-view/appointment-view.component';
import { AppointmentEditComponent } from './components/appointment-edit/appointment-edit.component';

@NgModule({
  declarations: [
    AppointmentListComponent,
    AppointmentCreateComponent,
    AppointmentViewComponent,
    AppointmentEditComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppointmentsRoutingModule,
    TimelineModule,
  ],
})
export class AppointmentsModule {}
