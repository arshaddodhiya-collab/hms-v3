import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VoiceNavigationComponent } from './voice-navigation.component';

const routes: Routes = [{ path: '', component: VoiceNavigationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VoiceNavigationRoutingModule { }
