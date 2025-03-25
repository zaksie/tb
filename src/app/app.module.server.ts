import {NgModule} from '@angular/core';
import {ServerModule} from '@angular/platform-server';
import {AppComponent} from './app.component';
import {AppModule} from './app.module';
import {AuthService} from "@auth0/auth0-angular";
import {of} from "rxjs";

@NgModule({
  imports: [AppModule, ServerModule],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: AuthService,
      useValue: {
        isAuthenticated$: of(false),
        user$: of({name: '', email: ''}),
      },
    },
  ],
})
export class AppServerModule {}
