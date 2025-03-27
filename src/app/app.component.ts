import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {AuthService} from "@auth0/auth0-angular";
import features from '../assets/features.json'
import {FeatureModel} from "./landing-page/feature/feature.model";
import {BackendService} from "./services/backend.service";
import {Observable} from "rxjs";
import {MatSidenav} from "@angular/material/sidenav";
import {MatDialog} from "@angular/material/dialog";
import {AccountDialog} from "./account/account.component";
import {texts} from "../environments/texts";
import {Meta, Title} from "@angular/platform-browser";
import {PlatformService} from "./services/platform.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Battle Squire';
  isAuthenticated$: Observable<boolean>;
  features: FeatureModel[] = features;
  readonly dialog = inject(MatDialog);
  readonly platform = inject(PlatformService)
  @ViewChild('snav') snav!: MatSidenav


  constructor(public router: Router, public authService: AuthService, public backend: BackendService,
              private meta: Meta, private titleService: Title, private activatedRoute: ActivatedRoute) {

    this.isAuthenticated$ = this.authService.isAuthenticated$
  }

  updateMetaTags() {
    this.titleService.setTitle(texts.title);

    // Standard Meta Tags
    this.meta.addTag({name: 'description', content: texts.description});
    this.meta.addTag({
      name: 'keywords',
      content: 'Chest counter, Chest tracker, epic monsters, totalbattle math, totalbattle, total battle, stack calculator, autocrypter, automatic crypting, autocrypting, automation for crypts'
    });

    // Open Graph Meta Tags
    this.meta.addTag({property: 'og:title', content: texts.title});
    this.meta.addTag({property: 'og:description', content: texts.description});
    this.meta.addTag({property: 'og:image', content: 'https://storage.googleapis.com/battle-squire/logo.jpg'});
  }

  ngOnInit() {
    this.updateMetaTags();
  }


  ngAfterViewInit(): void {
    if (!this.platform.isMobile())
      this.snav?.open()
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (this.platform.isMobile())
          this.snav?.close()
      }
    });
    this.activatedRoute.fragment.subscribe((fragment: string | null) => {
      if (fragment) this.jumpToSection(fragment);
    });
  }


  jumpToSection(section: string | null) {
    console.log({section})
    if (section)
      setTimeout(() => document.getElementById(section)?.scrollIntoView({behavior: 'smooth'}), 100)
  }

  logout() {
    this.authService.logout();
  }


  openAcountDialog() {
    this.dialog.open(AccountDialog,
      {data: {}}
    );
  }
}
