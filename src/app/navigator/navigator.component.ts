import {Component, inject, NgZone, signal} from '@angular/core';
import {BackendService} from "../services/backend.service";
import {ChestAgg} from "../models/clan-data.model";
import {FeatureModel} from "../landing-page/feature/feature.model";
import features from '../../assets/features.json'
import {AuthService} from "@auth0/auth0-angular";
import {filter, switchMap, tap} from "rxjs";
import {MatTreeNestedDataSource} from "@angular/material/tree";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {Router} from "@angular/router";


@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrl: './navigator.component.scss',
  standalone: false,
  //host: {ngSkipHydration: 'true'},
})
export class NavigatorComponent {
  readonly features: any[] = features.filter(feature => feature.visible.includes('nav'))

  childrenAccessor = (node: FeatureModel) => node.children ?? [];
  isAuthenticated = signal(false)
  dataSource = new MatTreeNestedDataSource<any>();
  router = inject(Router)
  readonly ngZone = inject(NgZone)
  constructor(public auth: AuthService,
              public backend: BackendService) {
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);
    this.features.filter(f => !!f.svg && !!f.icon).forEach(f => {
        iconRegistry.addSvgIconLiteral(f.icon, sanitizer.bypassSecurityTrustHtml(f.svg))
      }
    )
    this.addDisabledFunc({children: this.features} as any as FeatureModel)
    this.dataSource.data = this.features
    this.updateTree([])
    // this.ngZone.runOutsideAngular(() => {
      this.auth.isAuthenticated$.pipe(
        filter(isAuthenticated => isAuthenticated),
        switchMap(() => this.backend.dashboards$),
        tap(dashboards => this.updateTree(dashboards))
      ).subscribe(() => this.isAuthenticated.set(true))
    // })
  }

  addDisabledFunc(feature: FeatureModel) {
    feature.isDisabled = () => feature.disabled || !(feature.public || this.isAuthenticated())
    if (feature.children && feature.children.length > 0) {
      feature.children.forEach(child => this.addDisabledFunc(child));
    }
  }

  hasChild = (_: number, node: FeatureModel) => !!node.children && node.children.length > 0;
  isAccount = (_: number, node: FeatureModel) => node.isAccount

  private updateTree(res: ChestAgg[]) {
    const res2 = res.map(r => this.enrichWithFeature(r))
    const dashboards = this.features.find(child => child.path === 'chests/dashboards')
    if (dashboards) {
      // @ts-ignore
      dashboards.children.length = 0
      // @ts-ignore
      dashboards.children.push(...res2)
    }
    // @ts-ignore
    this.dataSource.data = []
    this.dataSource.data = this.features
  }

  login() {
    this.auth.loginWithPopup().subscribe()
  }

  private enrichWithFeature(ps: ChestAgg) {
    const step1: FeatureModel = {
      name: `K${ps?.kingdom} ${ps?.clanTag} / ${ps?.playerName}`,
      path: [`/chests/dashboards/${ps.clanTag}/${ps.playerName}`]
    }
    const step2 = {...step1, ...ps}
    this.addDisabledFunc(step2)
    return step2
  }

  navigateTo(node: any) {
    if (node.children && node.children.length > 0) return;
    this.router.navigate([node.path])
  }
}
