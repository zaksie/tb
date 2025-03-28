import {AfterViewInit, ChangeDetectionStrategy, Component, inject, model, signal, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {BackendService} from "../services/backend.service";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {CryptConfig} from "./crypts.model";
import {filter, firstValueFrom, of} from "rxjs";
import {ActionableRow, ServiceInterface} from "../services/service-interface";
import {catchError} from "rxjs/operators";
import {AuthService} from "@auth0/auth0-angular";
import {ChestCounter} from "../models/clan-data.model";
import {NewServiceComponent} from "../common/new-service/new-service.component";


@Component({
  selector: 'app-crypts',
  templateUrl: './crypts.component.html',
  styleUrl: './crypts.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class CryptsComponent implements AfterViewInit {
  readonly columnsMobile: string[] = ['username', 'progress', 'status', 'expand'];
  readonly columnsExtra: string[] = ['details', 'actions'];
  public readonly dataSource = new MatTableDataSource<CryptConfig>([]);
  readonly name = model('');
  readonly dialog = inject(MatDialog);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  readonly isLoading = signal(false);
  expandedRow: ChestCounter | null = null

  isExpanded(row: ChestCounter) {
    return this.expandedRow === row;
  }

  toggle(row: ChestCounter) {
    this.expandedRow = this.isExpanded(row) ? null : row;
  }

  constructor(protected backend: BackendService, private auth: AuthService) {
  }

  openDialog(data: any = {low: 1, high: 35, start: 1, end: 6}): void {
    console.log('crypts dialog data:',data)
    const dialogRef = this.dialog.open(NewServiceComponent,
      {data: {...data, serviceName: 'crypts'}}
    )

    dialogRef.afterClosed().subscribe(value => {
      if (value)
        this.fetch()
    });
  }

  async fetch() {
    const isAuthenticated = await firstValueFrom(this.auth.isAuthenticated$)
    if (isAuthenticated) {
      this.isLoading.set(true)
      this.backend.getCryptExplorers().pipe(
        catchError(e => {
          console.error(e)
          return of([])
        })
      )
        .subscribe(rows => this.populateData(rows))
    }
  }


  ngAfterViewInit() {
    this.auth.isAuthenticated$.pipe(
      filter(x => x)
    ).subscribe(() => this.fetch())
    this.dataSource.paginator = this.paginator;
  }

  populateData(data: CryptConfig[]) {
    console.log('data', data)
    this.dataSource.data = data
    this.isLoading.set(false)
    console.log('setting isLoading to false')

  }

  edit(row: ActionableRow) {
    this.openDialog(row)
  }


  getCryptTypes(row: CryptConfig) {
    const types = []
    types.push(row.common ? 'Common' : null)
    types.push(row.rare ? 'Rare' : null)
    types.push(row.epic ? 'Epic' : null)
    return types.filter(x => !!x)
  }

  getSchedule(row: CryptConfig, withTimezone = true) {
    const startStr = row.start.toString().padStart(2, '0') + ':00'
    const endStr = row.end.toString().padStart(2, '0') + ':00'
    return startStr + '-' + endStr + (withTimezone ? ' ' + row.timezone: '')
  }

  protected readonly ServiceInterface = ServiceInterface;
}

