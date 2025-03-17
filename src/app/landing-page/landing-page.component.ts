import {Component, OnInit} from '@angular/core';
import {FeatureModel} from "./feature/feature.model";
import {AuthService} from "@auth0/auth0-angular";
import features from '../../assets/features.json'
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BackendService} from "../services/backend.service";
import {ContactRequest} from "../models/clan-data.model";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  standalone: false
})
export class LandingPageComponent implements OnInit {
  showContactForm: boolean = false;
  features: FeatureModel[] = features;
  contactFormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    cityCoords: new FormControl('', Validators.required),
    message: new FormControl('')
  })
  messageSent: boolean = false;
  constructor(public auth: AuthService, private backend: BackendService) {
  }

  ngOnInit() {
    this.auth.getAccessTokenSilently()
    this.auth.user$.subscribe((user) => {
      console.log(user)
    })
    this.auth.isAuthenticated$.subscribe((authenticated) => {
      if (authenticated) {
        console.log('authenticated')
      }
    });
  }

  login() {
    this.auth.loginWithPopup()
  }

  logout(){
    this.auth.logout();
  }


  onSubmit() {
    console.log('sending...')
    this.backend.createContactRequest(this.contactFormGroup.value as any as ContactRequest).subscribe(res => {
      console.log(res)
      this.messageSent = true
    })
  }
}
