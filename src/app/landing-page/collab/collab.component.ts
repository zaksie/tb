import {Component} from '@angular/core';
import {BackendService} from "../../services/backend.service";

@Component({
  selector: 'app-collab',
  standalone: false,
  templateUrl: './collab.component.html',
  styleUrl: './collab.component.scss'
})
export class CollabComponent {
  referral: string|undefined;
  constructor(public backend: BackendService) {
    this.backend.getReferral().subscribe(data => this.referral = data.referral_code)
  }
  createReferral() {
    this.backend.createReferral().subscribe(data => this.referral = data.referral_code)

  }
}
