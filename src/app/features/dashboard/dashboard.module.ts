import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StatsCardsComponent } from './components/stats-cards/stats-cards.component';
import { TodayActivityComponent } from './components/today-activity/today-activity.component';

@NgModule({
  declarations: [
    DashboardComponent,
    StatsCardsComponent,
    TodayActivityComponent,
  ],
  imports: [SharedModule, DashboardRoutingModule],
})
export class DashboardModule {}
