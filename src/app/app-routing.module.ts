import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StackerComponent} from "./stacker/stacker.component";
import {CpClanRunsComponent} from "./cp-clan-runs/cp-clan-runs.component";
import {ChestCounterComponent} from "./chest-counter/chest-counter.component";
import {LandingPageComponent} from "./landing-page/landing-page.component";
import {ViewChestCounterComponent} from "./chest-counter/view-chest-counter/view-chest-counter.component";
import {DashboardComponent} from "./chest-counter/dashboard/dashboard.component";
import {ManageChestCounterComponent} from "./chest-counter/manage-chest-counter/manage-chest-counter.component";
import {MercExchangeComponent} from "./merc-exchange/merc-exchange.component";
import {CryptsComponent} from "./crypts/crypts.component";
import {DemoChestCounterComponent} from "./landing-page/demo-chest-counter/demo-chest-counter.component";
import {DemoStackerComponent} from "./landing-page/demo-stacker/demo-stacker.component";
import {DemoCryptsComponent} from "./landing-page/demo-crypts/demo-crypts.component";
import {CheckoutComponent} from "./account/checkout/checkout.component";
import {AccountComponent} from "./account/account.component";
import {PricingContainerComponent} from "./account/pricing-container/pricing-container.component";

const routes: Routes = [
  {path: '', component: LandingPageComponent},
  {path: 'home', component: LandingPageComponent},
  {
    path: 'account',
    children: [
      {
        path: '',
        component: AccountComponent,
      },
      {
        path: 'payment',
        component: CheckoutComponent
      },
      {
        path: 'plan',
        component: PricingContainerComponent
      }
    ]
  },
  {path: 'stacker', component: StackerComponent},
  {path: 'crypts', component: CryptsComponent},
  {path: 'merc-exchange', component: MercExchangeComponent},
  {path: 'cp-run', component: CpClanRunsComponent},
  {
    path: 'demo',
    children: [
      {
        path: 'chest-counter',
        component: DemoChestCounterComponent
      },
      {
        path: 'stacker',
        component: DemoStackerComponent
      },
      {
        path: 'crypts',
        component: DemoCryptsComponent
      },
    ]
  },
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
        path: 'dashboards/:clanTag/:playerName', // child route path
        component: DashboardComponent, // child route component that the router renders
      }
    ]
  },
];

@NgModule({

  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload',
      scrollOffset: [0, 50],
      // relativeLinkResolution: 'legacy',
      useHash: false,
      bindToComponentInputs: true,
      paramsInheritanceStrategy: 'always'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

