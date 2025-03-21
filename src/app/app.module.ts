import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SquadComponent} from './stacker/squad/squad.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule} from "@angular/material/card";
import {MatSliderModule} from "@angular/material/slider";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {StoreModule} from '@ngrx/store';
import {appReducer} from "./store/state.reducer";
import {MatListModule} from "@angular/material/list";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTabsModule} from "@angular/material/tabs";
import {BonusesComponent} from './bonuses/bonuses.component';
import {MatStepperModule} from "@angular/material/stepper";
import {TargetSquadComponent} from './stacker/target-squad/target-squad.component';
import {MatSelectModule} from "@angular/material/select";
import {RomanPipe} from "./pipes/roman.pipe";
import {StackerComponent} from './stacker/stacker.component';
import {CpClanRunsComponent} from './cp-clan-runs/cp-clan-runs.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatTooltipModule} from "@angular/material/tooltip";
import {RedirectGuard} from "./services/redirect-guard.service";
import {MatRadioModule} from "@angular/material/radio";
import {FlexLayoutModule} from "@angular/flex-layout";
import {ChestCounterComponent} from './chest-counter/chest-counter.component';
import {LandingPageComponent} from './landing-page/landing-page.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatTableModule} from "@angular/material/table";
import {FeatureComponent} from "./landing-page/feature/feature.component";
import {authHttpInterceptorFn, provideAuth0} from "@auth0/auth0-angular";
import {environment} from "../environments/environment";
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from "@angular/cdk/menu";
import {MatMenuModule} from "@angular/material/menu";
import {HomeComponent} from "./home/home.component";
import {ViewChestCounterComponent} from "./chest-counter/view-chest-counter/view-chest-counter.component";
import {MatSortModule} from "@angular/material/sort";
import {BackendService} from "./services/backend.service";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {DashboardComponent} from './chest-counter/dashboard/dashboard.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {NavigatorComponent} from './navigator/navigator.component';
import {MatTreeModule} from '@angular/material/tree';
import {
  CreateChestCounterDialog,
  ManageChestCounterComponent
} from "./chest-counter/manage-chest-counter/manage-chest-counter.component";
import {MatDialogModule} from "@angular/material/dialog";
import {ClanNameValidatorDirective} from './chest-counter/manage-chest-counter/clan-name-validator.directive'
import {MatChip, MatChipOption} from "@angular/material/chips";
import {authenticationErrorInterceptor} from "./services/authentication-error.interceptor";
import {MonacoEditorModule} from "ngx-monaco-editor-v2";
import {MercExchangeComponent} from "./merc-exchange/merc-exchange.component";
import {CreateCryptExplorerDialog, CryptsExplorerComponent} from "./crypts-explorer/crypts-explorer.component";
import {MatAutocomplete, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {TaskComponent} from "./common/task/task.component";
import {TableActionsComponent} from "./common/table-actions/table-actions.component";
import {TaskSetupComponent} from "./chest-counter/manage-chest-counter/task-setup/task-setup.component";
import {RequiresLoginDialog} from "./common/requires-login.dialog/requires-login-dialog.component";

const authorizationParams = {
  scope: "openid profile email offline_access",
  audience: 'https://dev-5ag1lfabqyttq1lj.us.auth0.com/api/v2/',
  redirect_uri: window.location.origin,
}


////

@NgModule({
  declarations: [
    ViewChestCounterComponent,
    AppComponent,
    SquadComponent,
    BonusesComponent,
    TargetSquadComponent,
    RomanPipe,
    StackerComponent,
    CpClanRunsComponent,
    ChestCounterComponent,
    LandingPageComponent,
    FeatureComponent,
    HomeComponent,
    DashboardComponent,
    NavigatorComponent,
    ManageChestCounterComponent,
    CreateChestCounterDialog,
    CreateCryptExplorerDialog,
    ClanNameValidatorDirective,
    MercExchangeComponent,
    CryptsExplorerComponent,
    TaskComponent,
    TableActionsComponent,
    TaskSetupComponent,
    RequiresLoginDialog
  ],
  imports: [
    FlexLayoutModule,
    MatCardModule,
    MatSliderModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot({state: appReducer}),
    MonacoEditorModule.forRoot(),
    MatListModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatStepperModule,
    MatSelectModule,
    MatToolbarModule,
    MatTooltipModule,
    MatRadioModule,
    MatSidenavModule,
    MatTableModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    CdkMenuTrigger,
    CdkMenuItem,
    CdkMenu,
    MatMenuModule,
    MatGridListModule,
    MatTreeModule,
    MatDialogModule,
    MatTabsModule,
    MatChip,
    MatChipOption,
    MatAutocomplete,
    MatAutocompleteTrigger
  ],
  providers: [
    provideAuth0({
      ...environment.auth,
      authorizationParams,
      useRefreshTokens: true,
      httpInterceptor: {
        allowedList: [
          '/api/v1/chest-counter*',
          '/api/v1/dashboards*',
          '/api/v1/merc-exchange*',
          '/api/v1/source-rule*',
          '/api/v1/subscriptions*',
          '/api/v1/crypts*'].map(x => environment.backend + x)
      }
    }),
    provideHttpClient(withInterceptors([authenticationErrorInterceptor, authHttpInterceptorFn])),
    RedirectGuard,
    BackendService,
    // {provide: APP_BASE_HREF, useValue: '/app'}
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
