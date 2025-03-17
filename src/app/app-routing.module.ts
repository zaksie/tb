import {NgModule} from '@angular/core';
import {RouterModule, Routes, withHashLocation, withRouterConfig} from '@angular/router';
import {StackerComponent} from "./stacker/stacker.component";
import {CpClanRunsComponent} from "./cp-clan-runs/cp-clan-runs.component";
import {RedirectGuard} from "./services/redirect-guard.service";
import {ChestCounterComponent} from "./chest-counter/chest-counter.component";
import {LandingPageComponent} from "./landing-page/landing-page.component";
import {HomeComponent} from "./home/home.component";
import {ViewChestCounterComponent} from "./chest-counter/view-chest-counter/view-chest-counter.component";
import {DashboardComponent} from "./chest-counter/dashboard/dashboard.component";
import {ManageChestCounterComponent} from "./chest-counter/manage-chest-counter/manage-chest-counter.component";
import {MercExchangeComponent} from "./merc-exchange/merc-exchange.component";
import {CryptsExplorerComponent} from "./crypts-explorer/crypts-explorer.component";

const routes: Routes = [
  {path: '', component: LandingPageComponent},
  {path: 'home', component: HomeComponent},
  {path: 'stacker', component: StackerComponent},
  {path: 'crypts', component: CryptsExplorerComponent},
  {path: 'merc-exchange', component: MercExchangeComponent},
  {path: 'cp-run', component: CpClanRunsComponent},
  {
    path: 'chests',
    children: [
      {
        path: '',
        component: ChestCounterComponent,
      },
      {
        path: 'view', // child route path
        component: ViewChestCounterComponent, // child route component that the router renders
      },
      {
        path: 'manage', // child route path
        component: ManageChestCounterComponent, // child route component that the router renders
      },
      {
        path: 'dashboards/:clanName/:playerName', // child route path
        component: DashboardComponent, // child route component that the router renders
      }
    ]
  },
  {
    path: 'koku-chests',
    canActivate: [RedirectGuard],
    component: RedirectGuard,
    data: {
      externalUrl: 'https://docs.google.com/spreadsheets/d/1OLN2LyeJFvVkppnIfxVSd86bqd-0JMAyyGTLMuJxpZQ'
    }
  }
];

@NgModule({

  imports: [RouterModule.forRoot(routes, {useHash: false,bindToComponentInputs: true, paramsInheritanceStrategy: 'always'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
