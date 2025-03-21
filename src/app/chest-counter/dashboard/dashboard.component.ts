import {Component, inject, Input, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {catchError, map} from 'rxjs/operators';
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "@auth0/auth0-angular";
import {BackendService} from "../../services/backend.service";
import {mergeMap, Observable, of} from "rxjs";
import {ChestAgg, GenericTask, NULL_DASHBOARD_TASK} from "../../models/clan-data.model";

export enum DashboardView {
  TASKS = 1
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: false
})
export class DashboardComponent implements OnInit {
  public _playerName!: string
  public _clanName!: string
  tasks$ = new Observable<GenericTask[]>()

  @Input()
  set playerName(value: string) {
    console.log(value)
    this._playerName = value
  }

  @Input()
  set clanName(value: string) {
    console.log(value)
    this._clanName = value
  }

  private breakpointObserver = inject(BreakpointObserver);

  constructor(private route: ActivatedRoute, private authService: AuthService, private backend: BackendService) {

  }

  ngOnInit(): void {
    this.tasks$ = this.route.paramMap.pipe(mergeMap((params) => {
        console.log('dashboard selection changed....')
        return this.backend.getDashboardTasks(params.get('clanName'), params.get('playerName'))
          .pipe(
            map(dashboardTasks => ([
              {
                counter: dashboardTasks.epicCryptCount,
                goal: dashboardTasks.epicCryptCountGoal,
                title: 'Epic Crypts'
              },
              {
                counter: dashboardTasks.score,
                goal: dashboardTasks.scoreGoal,
                title: 'Score'
              }
            ])),
            catchError(() => of(NULL_DASHBOARD_TASK))
          )
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
  protected readonly DashboardView = DashboardView;
  untracking: boolean = false;

  untrack() {
    this.untracking = true
    this.backend.untrackPlayer({clanName: this._clanName, playerName: this._playerName} as ChestAgg)
      .pipe(mergeMap(() => this.backend.getTrackPlayersList())).subscribe()
  }
}
