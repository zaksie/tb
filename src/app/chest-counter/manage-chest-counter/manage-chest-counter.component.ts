import {AfterViewInit, Component, inject, model, signal, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {ChestCounter, PointSystem} from "../../models/clan-data.model";
import {BackendService} from "../../services/backend.service";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {combineLatestWith, firstValueFrom, of} from "rxjs";
import {ServiceInterface} from "../../services/service-interface";
import {catchError} from "rxjs/operators";
import {AuthService} from "@auth0/auth0-angular";
import {NewServiceComponent} from "../../common/new-service/new-service.component";


@Component({
  selector: 'app-manage-chest-counter',
  templateUrl: './manage-chest-counter.component.html',
  styleUrl: './manage-chest-counter.component.scss',
  standalone: false
})
export class ManageChestCounterComponent implements AfterViewInit {
  protected readonly ServiceInterface = ServiceInterface;
  displayedColumns: string[] = ['username', 'kingdom', 'clanName', 'clanTag', 'status', 'actions'];
  public dataSource = new MatTableDataSource<ChestCounter>([]);
  readonly name = model('');
  readonly dialog = inject(MatDialog);
  private defaultPointSystem!: PointSystem[];
  isLoading = signal(false);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(protected backend: BackendService, private authService: AuthService) {
  }


  openDialog(data: any = {defaultPointSystem: this.defaultPointSystem}): void {
    const dialogRef = this.dialog.open(NewServiceComponent,
      {data}
    );

    dialogRef.afterClosed().subscribe(value => {
      if (value)
        this.fetch()
    });
  }


  async fetch() {
    this.isLoading.set(true)
    const isAuthenticated = await firstValueFrom(this.authService.isAuthenticated$)
    if (isAuthenticated) {
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
    this.fetch()
    this.dataSource.paginator = this.paginator;
  }

  populateData(data: ChestCounter[], pointSystem: PointSystem[]) {
    console.log('in populateData')
    this.defaultPointSystem = pointSystem || []
    this.dataSource.data = data || []
    this.isLoading.set(false)
    console.log('after populateData')
  }

  editRow(mouseEvent: MouseEvent, row: any) {
    this.openDialog({...row, defaultPointSystem: this.defaultPointSystem})
  }
}

