import {AfterViewInit, ChangeDetectionStrategy, Component, inject, model, signal, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {BackendService} from "../services/backend.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {CryptConfig} from "./crypts.model";
import {firstValueFrom, of} from "rxjs";
import {ServiceInterface} from "../services/service-interface";
import {catchError} from "rxjs/operators";
import {AuthService} from "@auth0/auth0-angular";


@Component({
  selector: 'app-crypts-explorer',
  templateUrl: './crypts-explorer.component.html',
  styleUrl: './crypts-explorer.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class CryptsExplorerComponent implements AfterViewInit {
  readonly displayedColumns: string[] = ['username', 'progress', 'kingdom', 'clan', 'range', 'types', 'schedule', 'status', 'actions'];
  public readonly dataSource = new MatTableDataSource<CryptConfig>([]);
  readonly name = model('');
  readonly dialog = inject(MatDialog);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  readonly isLoading = signal(false);


  constructor(protected backend: BackendService, private auth: AuthService) {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateCryptExplorerDialog,
      {data: {low: 1, high: 35, start: 1, end: 6}});

    dialogRef.afterClosed().subscribe(() => {
      this.fetch()
    });
  }

  async fetch() {
    this.isLoading.set(true)
    console.log('setting isLoading to true', this.auth.isAuthenticated$)
    const isAuthenticated = await firstValueFrom(this.auth.isAuthenticated$)
    if (isAuthenticated) {
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
    this.fetch()
    this.dataSource.paginator = this.paginator;
  }

  populateData(data: CryptConfig[]) {
    console.log('data', data)
    this.dataSource.data = data
    this.isLoading.set(false)
    console.log('setting isLoading to false')

  }

  editRow(mouseEvent: MouseEvent, row: any) {
    this.dialog.open(CreateCryptExplorerDialog,
      {data: row}
    );
  }


  getCryptTypes(row: CryptConfig) {
    const types = []
    types.push(row.common ? 'Common' : null)
    types.push(row.rare ? 'Rare' : null)
    types.push(row.epic ? 'Epic' : null)
    return types.filter(x => !!x).join(', ')
  }

  getSchedule(row: CryptConfig) {
    const startStr = row.start.toString().padStart(2, '0') + ':00'
    const endStr = row.end.toString().padStart(2, '0') + ':00'
    return startStr + '-' + endStr + ', ' + row.timezone
  }

  protected readonly ServiceInterface = ServiceInterface;
}


@Component({
  selector: 'create-crypts-explorer-dialog',
  templateUrl: 'crypts-explorer-dialog.html',
  standalone: false
})
export class CreateCryptExplorerDialog {
  readonly dialogRef = inject(MatDialogRef<CreateCryptExplorerDialog>);
  readonly data = inject<CryptConfig>(MAT_DIALOG_DATA);
  hide = signal(true);
  readonly backend = inject(BackendService)

  inputForm = new FormGroup({
    username: new FormControl(this.data?.username || '', Validators.required),
    password: new FormControl(this.data?.password || '', Validators.required),
    kingdom: new FormControl(this.data?.kingdom || '', Validators.required),
    clanTag: new FormControl(this.data?.clanTag || '', Validators.required),

    total: new FormControl(this.data?.total || 0, Validators.required),
    low: new FormControl(this.data?.low || 0, Validators.required),
    high: new FormControl(this.data?.high || 0, Validators.required),
    common: new FormControl(this.data?.common || true, Validators.required),
    rare: new FormControl(this.data?.rare || true, Validators.required),
    epic: new FormControl(this.data?.epic || true, Validators.required),

    start: new FormControl(this.data?.start || 0, Validators.required),
    end: new FormControl(this.data?.end || 0, Validators.required),
  });

  onNoClick(): void {
    this.dialogRef.close();
  }

  clickEvent(event: MouseEvent) {
    console.log(this.data)
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit() {
    const value = this.inputForm.getRawValue() as any as CryptConfig;
    console.log(value)
    value.timezone = this.getTimezone()
    this.backend.submitCryptConfig(value).subscribe(() => this.dialogRef.close())
  }

  formatHourLabel(value: number): string {
    return value.toString().padStart(2, '0') + ':00'
  }

  getTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  }
}
