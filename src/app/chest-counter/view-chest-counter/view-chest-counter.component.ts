import {AfterViewInit, Component, OnDestroy, signal, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {BackendService} from "../../services/backend.service";
import {ChestAgg, ChestCounter, ChestCounterResults, GenericTask} from "../../models/clan-data.model";
import {MatTableDataSource} from "@angular/material/table";
import {filter, mergeMap, Observable, of, Subscription, switchMap, tap} from "rxjs";
import {FormControl, Validators} from "@angular/forms";
import {groupBy} from "lodash";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "@auth0/auth0-angular";
import {catchError} from "rxjs/operators";


@Component({
  selector: 'app-view-chest-counter',
  templateUrl: './view-chest-counter.component.html',
  styleUrl: './view-chest-counter.component.scss',
  standalone: false
})
export class ViewChestCounterComponent implements AfterViewInit, OnDestroy {
  public dataSource = new MatTableDataSource<ChestAgg>([]);
  displayedColumns: string[] = ['track', 'playerName', 'epicCryptCount', 'totalScore', 'chestCount'];
  chestCounters$!: Observable<ChestCounter[]>
  tasks: GenericTask[] = [];
  currentClanTag: string = ''

  constructor(private router: Router, private route: ActivatedRoute, private backend: BackendService, private authService: AuthService) {
  }

  ngOnDestroy(): void {
  }

  @ViewChild(MatSort) sort!: MatSort;
  isLoading = signal(false);
  selectedChestCounter: any;
  // searchResults$!: Observable<Clan[]>;
  clanTagControl: FormControl = new FormControl('', Validators.required)
  getOptionText: ((value: any) => string) | null = (value: any) => value ? ['K', value.kingdom, ' ', value.tag].join('') : ''

  ngAfterViewInit() {
    this.dataSource.sort = this.sort
    this.route.params.subscribe(
      params => {
        const tag = params['tag'];
        this.getByClanTag(tag)
      }
    );
    this.chestCounters$ = this.authService.isAuthenticated$.pipe(
      filter(isAuthenticated => isAuthenticated),
      switchMap(() => this.backend.getChestCounters()),
      catchError(e => {
        console.error(e)
        return of([])
      })
    )
    // this.searchResults$ = this.clanTagControl.valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(300),
    //   mergeMap(value => this.searchForTag(value))
    // );
  }

  getByClanTag(clanTag: string) {
    this.currentClanTag = clanTag
    if (!clanTag) return
    this.isLoading.set(true)
    this.authService.isAuthenticated$.pipe(
      filter(isAuthenticated => isAuthenticated),
      switchMap(() => this.backend.getChestViewByClanTag(clanTag)),
      catchError(e => {
        console.error(e)
        return of(null)
      })
    ).subscribe(data => this.populateData(data))
  }

  populateData(data: ChestCounterResults | null) {
    console.log('data', data)
    const tasks = data?.stats[0].tasks || []
    const rows = data?.players || []
    this.tasks.length = 0
    this.tasks.push(...tasks)
    this.dataSource.data = rows
    this.dataSource.sort = this.sort
    this.isLoading.set(false)
  }

  readonly sourceCategories = [
    'Epic Crypt',
    'Rare Crypt',
    'Crypt',
    'Vault of the Ancients',
    'Union of Triumph personal reward',
    'Raid Runic squad',
    'heroic Monster'
  ]
  sourceCatgoriesFixes = [
    {
      original: 'Crypt',
      replaceWith: 'Common Crypt'
    },
    {
      original: 'Vault of the Ancients',
      replaceWith: 'Vault'
    },
    {
      original: 'Union of Triumph personal reward',
      replaceWith: 'Union of Triumph'
    },
    {
      original: 'Raid Runic squad',
      replaceWith: 'Raid Runic'
    },
    {
      original: 'heroic Monster',
      replaceWith: 'Heroics'
    },

  ]


  getTotalPlayerCount() {
    return this.dataSource.data.length
  }

  getTotalChestCount() {
    return this.dataSource.data.reduce((agg, x) => agg + x.chestCount, 0)
  }

  toggleTrackPlayer(row: ChestAgg) {
    console.log(row)
    row.tracked = !row.tracked
    if (row.tracked)
      this.backend.trackPlayer(row).pipe(mergeMap(() => this.backend.getTrackPlayersList())).subscribe()
    else
      this.backend.untrackPlayer(row).pipe(mergeMap(() => this.backend.getTrackPlayersList())).subscribe()
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
    this.router.navigate(['/chests/view', {tag: value || this.clanTagControl.value}]);
  }

  fetch() {
    this.getByClanTag(this.currentClanTag)
  }
}
