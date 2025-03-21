import {AfterViewInit, Component, OnDestroy, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {BackendService} from "../../services/backend.service";
import {ChestAgg, ChestCounter, GenericTask} from "../../models/clan-data.model";
import {MatTableDataSource} from "@angular/material/table";
import {filter, mergeMap, Observable, Subscription, switchMap, tap} from "rxjs";
import {FormControl, Validators} from "@angular/forms";
import {groupBy} from "lodash";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "@auth0/auth0-angular";


const GOALS = [0, 100, 5000, 10000]
@Component({
  selector: 'app-view-chest-counter',
  templateUrl: './view-chest-counter.component.html',
  styleUrl: './view-chest-counter.component.scss',
  standalone: false
})
export class ViewChestCounterComponent implements AfterViewInit, OnDestroy {
  public dataSource = new MatTableDataSource<ChestAgg>([]);
  displayedColumns: string[] = ['track', 'playerName', 'epicCryptCount', 'totalScore', 'chestCount'];
  chestCounters$: Observable<ChestCounter[]>
  tasks: GenericTask[] = [];
  subscription!: Subscription

  constructor(private router: Router, private route: ActivatedRoute, private backend: BackendService, private authService: AuthService) {
    this.chestCounters$ = this.backend.getChestCounters()
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }

  @ViewChild(MatSort) sort!: MatSort;
  isLoading: boolean = false;
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
    // this.searchResults$ = this.clanTagControl.valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(300),
    //   mergeMap(value => this.searchForTag(value))
    // );
  }

  getByClanTag(clanTag: string) {
    if (!clanTag) return;
    if (this.subscription)
      this.subscription.unsubscribe();
    this.subscription = this.authService.isAuthenticated$.pipe(
      filter(isAuthenticated => isAuthenticated),
      tap(() => this.isLoading = true),
      switchMap(() => this.backend.getChestViewByClanTag(clanTag))
    ).subscribe(data => this.populateData(data))
  }

  populateData(data: any[]) {
    this.isLoading = false
    console.log('data', data)
    this.tasks.length = 0
    const tasks = groupBy(data.flatMap(d => d.sources), d2 => this.getSourceCategory(d2))
    console.log(tasks)
    for (const [key, value] of Object.entries(tasks)) {
      this.tasks.push(<GenericTask>{
        counter: value.length,
        goal: GOALS[Math.floor(Math.random() * GOALS.length)],
        title: key
      })
    }
    this.dataSource.data = data
    this.dataSource.sort = this.sort
  }

  readonly sourceCategories = [
    'Epic Crypt' ,
    'Rare Crypt',
    'Crypt',
    'Vault of the Ancients',
    'Union of Triumph personal reward',
    'Raid Runic squad',
    'heroic Monster'
  ];
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

  private getSourceCategory(d2: any) {
    const name = d2.sourceName.toLowerCase()
    const res = this.sourceCategories.find(c => name.endsWith(c.toLowerCase())) || 'Other'
    return this.sourceCatgoriesFixes.find(f => f.original === res)?.replaceWith || res
  }

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
  onSubmit() {
    this.router.navigate(['/chests/view', {tag: this.clanTagControl.value}]);
  }
}
