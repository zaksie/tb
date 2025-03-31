import {Component, OnInit} from '@angular/core';
import {BackendService} from "../../services/backend.service";
import {AuthService} from "@auth0/auth0-angular";
import {filter, firstValueFrom, switchMap, tap} from "rxjs";

@Component({
  selector: 'app-collab',
  standalone: false,
  templateUrl: './collab.component.html',
  styleUrl: './collab.component.scss'
})
export class CollabComponent implements OnInit {
  referral: string | undefined;

  constructor(public auth: AuthService, public backend: BackendService) {
  }

  ngOnInit(): void {
    this.auth.isAuthenticated$.pipe(
      filter(x => x),
      switchMap(() => this.backend.getReferral()),
      tap(data => this.referral = data.referral_code)
    ).subscribe()
  }

  async createReferral() {
    const isAuthenticated = await firstValueFrom(this.auth.isAuthenticated$)
    if (!isAuthenticated) {
      this.auth.loginWithPopup();
    }
  }
}
