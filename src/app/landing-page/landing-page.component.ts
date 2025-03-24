import {Component, inject, OnInit, signal, ViewChild} from '@angular/core';
import {FeatureModel} from "./feature/feature.model";
import {AuthService} from "@auth0/auth0-angular";
import features from '../../assets/features.json'
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BackendService} from "../services/backend.service";
import {ContactRequest} from "../models/clan-data.model";
import {MatSidenav} from "@angular/material/sidenav";
import {MediaMatcher} from "@angular/cdk/layout";
import {Router} from "@angular/router";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  standalone: false
})
export class LandingPageComponent implements OnInit {

  features: FeatureModel[] = features.filter(x => !x.internalNavigation);
  contactFormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    cityCoords: new FormControl('', Validators.required),
    message: new FormControl('')
  })
  messageSent: boolean = false;
  protected readonly isMobile = signal(true);
  private readonly _mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;
  quickLinks = [
    {
      title: 'Stack calculator',
      path: 'stacker'
    },
    {
      title: 'View chest results',
        path: 'chests/view'
    }
  ]

  ngOnDestroy(): void {
    this._mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  constructor(public auth: AuthService,
              private backend: BackendService,
              private router: Router) {
    const media = inject(MediaMatcher);
    this._mobileQuery = media.matchMedia('(max-width: 800px)');
    this.isMobile.set(this._mobileQuery.matches);
    this._mobileQueryListener = () => this.isMobile.set(this._mobileQuery.matches);
    this._mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnInit() {
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
    this.auth.loginWithPopup().subscribe()
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

  goTo(link: {path: string}) {
    this.router.navigate([link.path]).then()
  }

  scrollToBottom() {
    // @ts-ignore
    document.getElementById("pricing").scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }
}
