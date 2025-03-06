import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SquadComponent} from './squad/squad.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule} from "@angular/material/card";
import {MatSliderModule} from "@angular/material/slider";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { StoreModule } from '@ngrx/store';
import {appReducer} from "./store/state.reducer";
import { LevelMainDivisionComponent } from './level-category-div/level-main-division.component';
import {MatListModule} from "@angular/material/list";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTabsModule} from "@angular/material/tabs";
import { BonusesComponent } from './bonuses/bonuses.component';
import {MatStepperModule} from "@angular/material/stepper";
import { TargetComponent } from './target/target.component';
import { TargetSquadComponent } from './target-squad/target-squad.component';
import {MatSelectModule} from "@angular/material/select";
import {RomanPipe} from "./pipes/roman.pipe";
import { StackerComponent } from './stacker/stacker.component';
import { CpClanRunsComponent } from './cp-clan-runs/cp-clan-runs.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatTooltipModule} from "@angular/material/tooltip";
import {RedirectGuard} from "./services/redirect-guard.service";
import {MatRadioModule} from "@angular/material/radio";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FlexLayoutModule} from "@angular/flex-layout";
import { ChestCounterComponent } from './chest-counter/chest-counter.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatTableModule} from "@angular/material/table";

@NgModule({
  declarations: [
    AppComponent,
    SquadComponent,
    LevelMainDivisionComponent,
    BonusesComponent,
    TargetComponent,
    TargetSquadComponent,
    RomanPipe,
    StackerComponent,
    CpClanRunsComponent,
    ChestCounterComponent,
    LandingPageComponent,
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
    MatTableModule
  ],
  providers: [RedirectGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
}
