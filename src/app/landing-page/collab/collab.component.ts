import {Component} from '@angular/core';
import {BackendService} from "../../services/backend.service";
import {AuthService} from "@auth0/auth0-angular";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-collab',
  standalone: false,
  templateUrl: './collab.component.html',
  styleUrl: './collab.component.scss'
})
export class CollabComponent {
  referral: string|undefined;
  constructor(public auth: AuthService, public backend: BackendService) {
    this.backend.getReferral().subscribe(data => this.referral = data.referral_code)
  }
  async createReferral() {
    const isAuthenticated = await firstValueFrom(this.auth.isAuthenticated$)
    if (isAuthenticated)
      this.backend.createReferral().subscribe(data => this.referral = data.referral_code)
    else{
      this.auth.loginWithPopup();
    }
  }
}
