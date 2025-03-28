import {Component, inject, OnInit, Renderer2, RendererFactory2} from '@angular/core';
import {FeatureModel} from "./feature/feature.model";
import {AuthService} from "@auth0/auth0-angular";
import features from '../../assets/features.json'
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BackendService} from "../services/backend.service";
import {ContactRequest} from "../models/clan-data.model";
import {Router} from "@angular/router";
import {texts} from "../../environments/texts";
import {PlatformService} from "../services/platform.service";

declare var document: any;
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  standalone: false
})
export class LandingPageComponent implements OnInit {
  private renderer = inject(Renderer2)
  private rendererFactory = inject(RendererFactory2)
  readonly platform = inject(PlatformService)
  features: FeatureModel[] = features.filter(x => x.visible.includes('features'));
  contactFormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    cityCoords: new FormControl('', Validators.required),
    message: new FormControl('')
  })
  messageSent: boolean = false;
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


  constructor(public auth: AuthService,
              private backend: BackendService,
              private router: Router) {

  }

  ngOnInit() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.addStructuredData();
    this.auth.user$.subscribe((user) => {
      console.log(user)
    })
    this.auth.isAuthenticated$.subscribe((authenticated) => {
      if (authenticated) {
        console.log('authenticated')
      }
    });
  }

  addStructuredData() {
    try {
      if (typeof document === 'undefined') return;
      const script = this.renderer.createElement('script');
      script.type = 'application/ld+json';
      script.text = `
    {
      "@context": "http://schema.org",
      "@type": "Organization",
      "name": "Battle Squire - TotalBattle Helper",
      "url": "https://battle-squire.com",
      "logo": "https://your-angular-app.com/logo.png",
      "description": "${texts.description}"
    }`;
      this.renderer.appendChild(document.head, script);
    }catch{}
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
    try {
      // @ts-ignore
      document.getElementById("pricing").scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
      });
    }catch{}
  }
}
