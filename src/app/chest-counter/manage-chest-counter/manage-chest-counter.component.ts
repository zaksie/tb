import {AfterViewInit, Component, inject, model, signal, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {ChestCounter, PointSystem} from "../../models/clan-data.model";
import {BackendService} from "../../services/backend.service";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {combineLatestWith, filter, firstValueFrom, of} from "rxjs";
import {ActionableRow, ServiceInterface} from "../../services/service-interface";
import {catchError} from "rxjs/operators";
import {AuthService} from "@auth0/auth0-angular";
import {NewServiceComponent} from "../../common/new-service/new-service.component";
import {ChestCounterForm} from "../../common/new-service/chest-counter.struct";


@Component({
  selector: 'app-manage-chest-counter',
  templateUrl: './manage-chest-counter.component.html',
  styleUrl: './manage-chest-counter.component.scss',
  standalone: false
})
export class ManageChestCounterComponent implements AfterViewInit {
  protected readonly ServiceInterface = ServiceInterface;
  readonly columnsBase = ['username', 'kingdom', 'clanTag']
  readonly columnsExtra = ['details', 'actions']
  readonly columnsMobile: string[] = [...this.columnsBase,'status', 'expand'];
  readonly columnMap: {[key: string]: string} = {
    username: 'Username',
    kingdom: 'K',
    clanTag: 'Tag',
    status: 'Status',
    actions: 'Actions'
  }
  public dataSource = new MatTableDataSource<ChestCounter>([]);
  readonly name = model('');
  readonly dialog = inject(MatDialog);
  private defaultPointSystem!: PointSystem[];
  isLoading = signal(false);
  expandedRow: ChestCounter | null = null

  isExpanded(row: ChestCounter) {
    return this.expandedRow === row;
  }

  toggle(row: ChestCounter) {
    this.expandedRow = this.isExpanded(row) ? null : row;
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(protected backend: BackendService, private auth: AuthService) {
  }


  openDialog(data: any = {defaultPointSystem: this.defaultPointSystem}): void {
    console.log('cc dialog data:',data)
    const dialogRef = this.dialog.open(NewServiceComponent,
      {data: {...data, serviceName: 'chest-counter'}}
    );

    dialogRef.afterClosed().subscribe(value => {
      if (value)
        this.fetch()
    });
  }


  async fetch() {
    const isAuthenticated = await firstValueFrom(this.auth.isAuthenticated$)
    if (isAuthenticated) {
      this.isLoading.set(true)
      this.backend.getChestCounters().pipe(
        combineLatestWith(this.backend.getDefaultPointSystem()),
        catchError(e => {
          console.error(e)
          return of([], [])
        })
      )
        .subscribe(([rows, ps]) => {
          this.populateData(rows, ps)
        })
    }
  }


  ngAfterViewInit() {
    this.auth.isAuthenticated$.pipe(
      filter(x => x)
    ).subscribe(() => this.fetch())
    this.dataSource.paginator = this.paginator;
  }

  populateData(data: ChestCounter[], pointSystem: PointSystem[]) {
    console.log('in populateData')
    this.defaultPointSystem = pointSystem || []
    this.dataSource.data = data || []
    this.isLoading.set(false)
    console.log('after populateData')
  }

  edit(row: ActionableRow) {
    console.log(row)
    this.openDialog({...row, defaultPointSystem: this.defaultPointSystem})
  }

  protected readonly ChestCounterForm = ChestCounterForm;
}

