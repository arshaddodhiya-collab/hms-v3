import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { VitalsViewComponent } from './components/vitals-view/vitals-view.component';

@NgModule({
  declarations: [VitalsViewComponent],
  imports: [SharedModule],
  exports: [VitalsViewComponent],
})
export class VitalsSharedModule {}
