import {Component, inject, Input, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {catchError, map} from 'rxjs/operators';
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "@auth0/auth0-angular";
import {BackendService} from "../../services/backend.service";
import {of, switchMap, tap} from "rxjs";
import {ChestAgg, DashboardTasks} from "../../models/clan-data.model";
import {Title} from "@angular/platform-browser";
import {titles} from "../../../environments/texts";

export enum DashboardView {
  TASKS = 1
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: false,
  //host: {ngSkipHydration: 'true'},
})
export class DashboardComponent implements OnInit {
  public _playerName!: string | null
  public _clanTag!: string | null
  dashboard: DashboardTasks = {} as any as DashboardTasks
  protected readonly DashboardView = DashboardView;
  isLoading: boolean = false;

  @Input()
  set playerName(value: string | null) {
    this._playerName = value
  }

  @Input()
  set clanTag(value: string | null) {
    this._clanTag = value
  }

  private breakpointObserver = inject(BreakpointObserver);

  constructor(private route: ActivatedRoute, private authService: AuthService, private backend: BackendService) {
    const titleService = inject(Title)
    titleService.setTitle(titles.favorites);
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(switchMap((params) => {
        this.isLoading = false
        console.log('dashboard selection changed....')
        this.clanTag = params.get('clanTag')
        this.playerName = params.get('playerName')
        return this.fetch$()
      })
    ).subscribe(() => this.isLoading = false)
  }

  fetch$() {
    return this.backend.getDashboardTasks(this._clanTag, this._playerName).pipe(
      tap(d => this.dashboard = d),
      catchError(e => {
        this.isLoading = false
        return of(e)
      })
    )
  }

  /** Based on the screen size, switch from standard to one column per row */
  cards$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({matches}) => {
      if (matches) {
        return [
          {cols: 2, rows: 1, type: DashboardView.TASKS, title: 'TASKS'},
        ];
      }

      return [
        {cols: 2, rows: 1, type: DashboardView.TASKS, title: 'TASKS'},
      ];
    })
  );


  toggleTrack() {
    this.isLoading = true
    const data = {clanTag: this._clanTag, playerName: this._playerName} as ChestAgg
    const obs = this.dashboard.tracked ? this.backend.untrackPlayer(data) : this.backend.trackPlayer(data)
    obs.pipe(switchMap(() => this.fetch$())).subscribe(() => this.isLoading = false)
  }
}
