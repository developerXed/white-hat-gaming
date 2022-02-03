import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'top-games', pathMatch: 'full'},
  { path: 'top-games', component: DashboardComponent },
  { path: 'new-games', component: DashboardComponent },
  { path: 'slots', component: DashboardComponent },
  { path: 'jackpots', component: DashboardComponent },
  { path: 'live', component: DashboardComponent },
  { path: 'blackjack', component: DashboardComponent },
  { path: 'roulette', component: DashboardComponent },
  { path: 'table', component: DashboardComponent },
  { path: 'poker', component: DashboardComponent },
  { path: 'other', component: DashboardComponent },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
