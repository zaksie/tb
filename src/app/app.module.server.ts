import {NgModule} from '@angular/core';
import {ServerModule} from '@angular/platform-server';
import {AppComponent} from './app.component';
import {AppModule} from './app.module';
import {AuthHttpInterceptor, AuthService} from "@auth0/auth0-angular";
import {EMPTY} from "rxjs";
import {FlexLayoutServerModule} from "@angular/flex-layout/server";
import {Socket} from "ngx-socket-io";

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    FlexLayoutServerModule
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide:  AuthHttpInterceptor,
      useValue: {
        intercept: (req: any, next: any) => next.handle(req)
      }
    },
    {
      provide: AuthService,
      useValue: {
        isAuthenticated$: EMPTY,
        user$:  EMPTY,
        loginWithPopup:  EMPTY,
      }
    },
    {
      provide: Socket,
      useValue: {
        emit: (_1: string, _2: string) =>  EMPTY,
        fromEvent: (_: string) =>   EMPTY,
      }
    }
  ],
})
export class AppServerModule {
}
