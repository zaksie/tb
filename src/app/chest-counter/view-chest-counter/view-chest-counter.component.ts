import {AfterViewInit, Component, inject, NgZone, OnDestroy, signal, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {BackendService} from "../../services/backend.service";
import {ChestAgg, ChestCounter, ChestCounterResults, GenericTask} from "../../models/clan-data.model";
import {MatTableDataSource} from "@angular/material/table";
import {filter, Observable, of, Subscription, switchMap, take, tap} from "rxjs";
import {FormControl, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "@auth0/auth0-angular";
import {catchError} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {AppGenericDialog} from "../../common/app-generic-dialog/app-generic-dialog";
import {Socket} from "ngx-socket-io";
import {v4 as uuidv4} from 'uuid';
import {MatSnackBar} from "@angular/material/snack-bar";
import {PlatformService} from "../../services/platform.service";
import {Title} from "@angular/platform-browser";
import {titles} from "../../../environments/texts";


@Component({
  selector: 'app-view-chest-counter',
  templateUrl: './view-chest-counter.component.html',
  styleUrl: './view-chest-counter.component.scss',
  standalone: false,
  //host: {ngSkipHydration: 'true'},
})
export class ViewChestCounterComponent implements AfterViewInit, OnDestroy {
  public dataSource = new MatTableDataSource<ChestAgg>([]);
  displayedColumns: string[] = ['track', 'playerName', 'epicCryptCount', 'totalScore'];
  chestCounters$!: Observable<ChestCounter[]>
  tasks: GenericTask[] = [];
  private _currentClanTag: string = '';
  private _currentClanTagSubscription!: Subscription
  platform = inject(PlatformService)
  isFirstTime: boolean = this.platform.isBrowser ? localStorage.getItem("ViewChestCounterComponent.exampleClicked") !== 'true' : false

  get currentClanTag(): string {
    return this._currentClanTag
  }

  set currentClanTag(value: string) {
    this._currentClanTag = value
    if (this._currentClanTagSubscription)
      this._currentClanTagSubscription.unsubscribe();
    this._currentClanTagSubscription = this.websocket.fromEvent('api/v1/chests/' + value).pipe(
      tap((data: ChestCounterResults) => {
        if (!data) return;
        console.log('received from server: ', data)
        const player = data?.players[0]
        const task = this.tasks.find(t => t.source === player.sources[0].shortSourceName)
        if (task) {
          task.counter++
          task.hash = uuidv4().toString()
        }

        const dataPoint = this.dataSource.data.find(row => row.playerName === player.playerName)
        if (dataPoint) {
          dataPoint.chestCount += player.chestCount
          dataPoint.totalScore += player.totalScore
          dataPoint.epicCryptCount += player.epicCryptCount
        }

        this.dataSource.sort = this.sort
      })
    ).subscribe()
  }

  readonly dialog = inject(MatDialog);
  websocket = inject(Socket)

  constructor(private router: Router, private route: ActivatedRoute, private backend: BackendService, private auth: AuthService) {
    const titleService = inject(Title)
    titleService.setTitle(titles.viewChests);
  }

  ngOnDestroy(): void {
    if (this._currentClanTagSubscription)
      this._currentClanTagSubscription.unsubscribe()
  }

  @ViewChild(MatSort) sort!: MatSort;
  isLoading = signal(false);
  selectedChestCounter: any;
  // searchResults$!: Observable<Clan[]>;
  clanTagControl: FormControl = new FormControl('', Validators.required)
  getOptionText: ((value: any) => string) | null = (value: any) => value ? ['K', value.kingdom, ' ', value.tag].join('') : ''

  private _snackBar = inject(MatSnackBar);
  readonly ngZone = inject(NgZone)


  ngAfterViewInit() {
    const duration = this.isFirstTime ? 1000 * 9999999 : 1000 * 5
    const snackBarRef = this._snackBar.open('See an example clan', 'GO', {duration});
    snackBarRef.onAction().subscribe(() => {
      this.exampleClicked()
    });
    const paramTag = this.route.snapshot.params['tag']
    console.log({paramTag})
    this.getByClanTag(paramTag)
    this.route.params.subscribe(
      params => {
        const tag = params['tag'];
        this.clanTagControl.setValue(tag)
        this.getByClanTag(tag)
      }
    );
    // this.ngZone.runOutsideAngular(() => {
      this.chestCounters$ = this.auth.isAuthenticated$.pipe(
        filter(isAuthenticated => isAuthenticated),
        switchMap(() => this.backend.getChestCounters()),
        catchError(e => {
          console.error(e)
          return of([])
        })
      )
    // })
    // this.searchResults$ = this.clanTagControl.valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(300),
    //   mergeMap(value => this.searchForTag(value))
    // );
  }

  getByClanTag(clanTag: string) {
    if (!clanTag || !this.platform.isBrowser) return
    this.currentClanTag = clanTag
    console.log('getByClanTag ', clanTag)
    this.isLoading.set(true)
    this.backend.getChestViewByClanTag(clanTag).pipe(
      catchError(e => {
        console.error(e)
        return of(null)
      }),
      take(1),
    ).subscribe(data => this.populateData(data))
  }

  populateData(data: ChestCounterResults | null) {
    this.isLoading.set(false)
    console.log('data', data)
    const tasks = (data?.stats?.[0]?.tasks || []).map(x => {
      return {
        ...x,
        hash: uuidv4().toString(),
        sources: x.sources?.map(y => y.toLowerCase())
      }
    })
    console.log('tasks', tasks)
    const rows = data?.players || []
    rows.forEach((row) => this.addState(row, data?.stats[0]))
    this.tasks.length = 0
    this.tasks.push(...tasks)
    this.dataSource.data = rows
    this.dataSource.sort = this.sort
  }

  getTotalPlayerCount() {
    return this.dataSource.data.length
  }

  getTotalChestCount() {
    return this.dataSource.data.reduce((agg, x) => agg + x.chestCount, 0)
  }

  private _toggleTrackPlayerAuthenticated(row: ChestAgg) {
    row.tracked = !row.tracked
    if (row.tracked)
      this.backend.trackPlayer(row).subscribe()
    else
      this.backend.untrackPlayer(row).subscribe()
  }

  toggleTrackPlayer(row: ChestAgg) {
    this.auth.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this._toggleTrackPlayerAuthenticated(row)
      } else {
        const dialogRef = this.dialog.open(AppGenericDialog,
          {data: {}}
        );

        dialogRef.afterClosed().subscribe(isAuthenticated => {
          if (isAuthenticated)
            this._toggleTrackPlayerAuthenticated(row)
        })
      }
    })
  }

// private searchForTag(value: string) {
//   console.log(window.location.origin)
//   return this.backend.searchForClanTag(value)
// }
  get dateRangeStart(): Date {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const offsetToLastSunday = (currentDay + 7) % 7;
    const lastSundayDate = new Date(currentDate);
    lastSundayDate.setDate(currentDate.getDate() - offsetToLastSunday);
    return lastSundayDate
  }

  onSubmit(value = null) {
    if (this.clanTagControl.value === this.currentClanTag)
      this.fetch()
    else
      this.router.navigate(['/chests/view', {tag: value || this.clanTagControl.value}]);
  }

  fetch() {
    this.getByClanTag(this.currentClanTag)
  }

  private addState(row: ChestAgg, stats: ChestCounter | undefined) {
    if (!!stats?.minScore)
      row.pass = row.totalScore >= stats.minScore && row.epicCryptCount >= stats.minEpicCryptCount
  }


  onRowClicked(row: ChestAgg) {
    this.router.navigate(['chests/dashboards/' + row.clanTag + '/' + row.playerName])
  }

  exampleClicked() {
    if (this.platform.isBrowser)
      localStorage?.setItem("ViewChestCounterComponent.exampleClicked", 'true')
    this.router.navigate(['chests/view', {tag: 'FAR'}]).then(() => this.isFirstTime = false)
  }
}
