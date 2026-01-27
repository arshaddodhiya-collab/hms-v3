import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AppointmentsRoutingModule } from './appointments-routing.module';
import { AppointmentListComponent } from './components/appointment-list/appointment-list.component';
import { AppointmentCreateComponent } from './components/appointment-create/appointment-create.component';
import { AppointmentViewComponent } from './components/appointment-view/appointment-view.component';

@NgModule({
  declarations: [
    AppointmentListComponent,
    AppointmentCreateComponent,
    AppointmentViewComponent,
  ],
  imports: [SharedModule, AppointmentsRoutingModule],
})
export class AppointmentsModule {}
