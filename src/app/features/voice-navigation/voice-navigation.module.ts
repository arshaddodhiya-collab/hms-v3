import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VoiceNavigationRoutingModule } from './voice-navigation-routing.module';
import { VoiceNavigationComponent } from './voice-navigation.component';


@NgModule({
  declarations: [
    VoiceNavigationComponent
  ],
  imports: [
    CommonModule,
    VoiceNavigationRoutingModule
  ]
})
export class VoiceNavigationModule { }
