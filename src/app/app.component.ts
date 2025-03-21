import {AfterViewInit, ChangeDetectionStrategy, Component, inject, OnDestroy, signal, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {AuthService} from "@auth0/auth0-angular";
import features from '../assets/features.json'
import {FeatureModel} from "./landing-page/feature/feature.model";
import {BackendService} from "./services/backend.service";
import {Observable, of, switchMap} from "rxjs";
import {MediaMatcher} from "@angular/cdk/layout";
import {MatSidenav} from "@angular/material/sidenav";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnDestroy, AfterViewInit {
  title = 'Battle Squire for TotalBattle';
  isAuthenticated$: Observable<boolean>;
  features: FeatureModel[] = features;
  protected readonly isMobile = signal(true);

  private readonly _mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;
  @ViewChild('snav') snav!: MatSidenav

  ngOnDestroy(): void {
    this._mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  constructor(public router: Router, public authService: AuthService, public backend: BackendService) {
    // this.router.navigate(['/stacker']).then();
    console.log(features)
    const media = inject(MediaMatcher);

    this._mobileQuery = media.matchMedia('(max-width: 600px)');
    this.isMobile.set(this._mobileQuery.matches);
    this._mobileQueryListener = () => this.isMobile.set(this._mobileQuery.matches);
    this._mobileQuery.addEventListener('change', this._mobileQueryListener);

    this.isAuthenticated$ = this.authService.isAuthenticated$
    this.authService.isLoading$.subscribe(x => console.log(x))
    this.authService.error$.subscribe(err => console.log(err))
    this.authService.appState$.subscribe(x => console.log(x))
  }

  ngAfterViewInit(): void {
    this.authService.isAuthenticated$.pipe(
      switchMap(isAuthenticated =>
        isAuthenticated ? of(true) : this.authService.loginWithPopup()
      )).subscribe(value => {
      console.log('Authenticated:', value)
      if (value) this.snav.open()
    })
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (this.isMobile())
          this.snav.close()
      }
    });
  }

  openUserSettings() {

  }

  logout() {
    this.authService.logout();
  }


}
