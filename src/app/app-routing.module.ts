import { NgModule } from '@angular/core';
import {RouterModule, Routes, withHashLocation} from '@angular/router';
import {StackerComponent} from "./stacker/stacker.component";
import {CpClanRunsComponent} from "./cp-clan-runs/cp-clan-runs.component";
import {RedirectGuard} from "./services/redirect-guard.service";

const routes: Routes = [
  { path: 'stacker', component: StackerComponent },
  { path: 'cp-clan-runs', component: CpClanRunsComponent },
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
