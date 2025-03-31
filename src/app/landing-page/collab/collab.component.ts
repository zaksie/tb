import {Component, inject, NgZone, OnInit} from '@angular/core';
import {BackendService} from "../../services/backend.service";
import {AuthService} from "@auth0/auth0-angular";
import {filter, firstValueFrom, switchMap} from "rxjs";

@Component({
  selector: 'app-collab',
  standalone: false,
  templateUrl: './collab.component.html',
  styleUrl: './collab.component.scss'
})
export class CollabComponent implements OnInit {
  referral: string | undefined;
  readonly ngZone = inject(NgZone)

  constructor(public auth: AuthService, public backend: BackendService) {
  }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.auth.isAuthenticated$.pipe(
        filter(x => x),
        switchMap(() => this.backend.getReferral()),
      ).subscribe(data => this.referral = data?.referral_code)
    })
  }

  async createReferral() {
    const isAuthenticated = await firstValueFrom(this.auth.isAuthenticated$)
    console.log('createReferral', isAuthenticated)
    if (!isAuthenticated) {
      this.auth.loginWithPopup().subscribe();
    }
  }
}
