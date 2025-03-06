import { NgModule } from '@angular/core';
import {RouterModule, Routes, withHashLocation} from '@angular/router';
import {StackerComponent} from "./stacker/stacker.component";
import {CpClanRunsComponent} from "./cp-clan-runs/cp-clan-runs.component";
import {RedirectGuard} from "./services/redirect-guard.service";
import {ChestCounterComponent} from "./chest-counter/chest-counter.component";
import {LandingPageComponent} from "./landing-page/landing-page.component";

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'stacker', component: StackerComponent },
  { path: 'cp-clan-runs', component: CpClanRunsComponent },
  { path: 'chest-counter', component: ChestCounterComponent },
  {path: 'koku-chests',
    canActivate: [RedirectGuard],
    component: RedirectGuard,
    data: {
      externalUrl: 'https://docs.google.com/spreadsheets/d/1OLN2LyeJFvVkppnIfxVSd86bqd-0JMAyyGTLMuJxpZQ'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
