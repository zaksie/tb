import {Injectable, Inject, PLATFORM_ID, inject, signal, OnDestroy} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {MediaMatcher} from "@angular/cdk/layout";

@Injectable({
  providedIn: 'root'
})
export class PlatformService implements OnDestroy {
  private readonly _isBrowser: boolean;
  readonly isMobile = signal(false);
  private readonly _mobileQuery!: MediaQueryList;
  private readonly _mobileQueryListener!: () => void;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this._isBrowser = isPlatformBrowser(this.platformId);
    if (this._isBrowser) {
      console.log('setting isMobile...')
      const media = inject(MediaMatcher);
      this._mobileQuery = media.matchMedia('(max-width: 600px)');
      this.isMobile.set(this._mobileQuery.matches);
      console.log('setting isMobile... to ', this.isMobile())
      this._mobileQueryListener = () => this.isMobile.set(this._mobileQuery.matches);
      this._mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

  }
  get isServer(): boolean {
    return !this._isBrowser;
  }
  get isBrowser(): boolean {
    return this._isBrowser;
  }

  ngOnDestroy(): void {
    if (this._mobileQuery)
      this._mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
