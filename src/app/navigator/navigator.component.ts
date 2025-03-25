import {Component, signal} from '@angular/core';
import {BackendService} from "../services/backend.service";
import {ChestAgg, enrichWithFeature} from "../models/clan-data.model";
import {FeatureModel} from "../landing-page/feature/feature.model";
import features from '../../assets/features.json'
import {AuthService} from "@auth0/auth0-angular";
import {filter, switchMap, tap} from "rxjs";
import {MatTreeNestedDataSource} from "@angular/material/tree";


@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrl: './navigator.component.scss',
  standalone: false
})
export class NavigatorComponent {

  childrenAccessor = (node: FeatureModel) => node.children ?? [];
  isAuthenticated = signal(false)
  dataSource = new MatTreeNestedDataSource<any>();

  constructor(public auth: AuthService, public backend: BackendService) {
    this.dataSource.data = features
    this.backend.dashboards$
      .pipe(tap(x => console.log('dashboard update', x)))
      .subscribe(dashboards => this.updateTree(dashboards))
    this.auth.isAuthenticated$.pipe(
      filter(isAuthenticated => isAuthenticated),
      switchMap(() => this.backend.getTrackPlayersList())
    ).subscribe(() => this.isAuthenticated.set(true))

  }

  hasChild = (_: number, node: FeatureModel) => !!node.children && node.children.length > 0;

  private updateTree(res: ChestAgg[]) {
    const f: FeatureModel = features.find(f => f.name === 'Chest Counter') as any as FeatureModel;
    if (!!f) {
      const res2 = res.map(r => enrichWithFeature(r))
      const dashboards = f.children?.find(child => child.name === 'Dashboards')
      if (dashboards) {
        // @ts-ignore
        dashboards.children.length = 0
        // @ts-ignore
        dashboards.children.push(...res2)
      }
      // @ts-ignore
      this.dataSource.data = []
      this.dataSource.data = features
    }else{
      console.warn(`Failed to find 'Chest Counter' in tree`)
    }
  }

  login() {
    this.auth.loginWithPopup().subscribe()
  }
}
