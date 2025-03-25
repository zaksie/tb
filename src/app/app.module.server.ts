import {NgModule} from '@angular/core';
import {ServerModule} from '@angular/platform-server';
import {AppComponent} from './app.component';
import {AppModule} from './app.module';
import {AuthService} from "@auth0/auth0-angular";
import {of} from "rxjs";
import {FlexLayoutServerModule} from "@angular/flex-layout/server";
import {Socket} from "ngx-socket-io";
import {provideHttpClient, withFetch} from "@angular/common/http";

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    FlexLayoutServerModule
  ],
  bootstrap: [AppComponent],
  providers: [
    provideHttpClient(withFetch()),
    {
      provide: AuthService,
      useValue: {
        isAuthenticated$: of(false),
        user$: of(null),
        loginWithPopup: of(null)
      }
    },
    {
      provide: Socket,
      useValue: {
        emit: (_1: string, _2: string) => of(null),
        fromEvent: (_: string) =>  of(null),
      }
    }
  ],
})
export class AppServerModule {
}
