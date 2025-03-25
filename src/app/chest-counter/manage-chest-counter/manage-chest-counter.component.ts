import {AfterViewInit, Component, inject, model, OnInit, signal, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {ChestCounter, GenericTask, PointSystem} from "../../models/clan-data.model";
import {BackendService} from "../../services/backend.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ClanNameValidatorDirective} from "./clan-name-validator.directive";
import {MatTableDataSource} from "@angular/material/table";
import {combineLatestWith, firstValueFrom, of} from "rxjs";
import {ServiceInterface} from "../../services/service-interface";
import {catchError} from "rxjs/operators";
import {AuthService} from "@auth0/auth0-angular";
import {TaskSetupComponent} from "./task-setup/task-setup.component";


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


  openDialog(): void {
    const dialogRef = this.dialog.open(CreateChestCounterDialog,
      {data: {defaultPointSystem: this.defaultPointSystem}}
    );

    dialogRef.afterClosed().subscribe(() => {
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
    this.dialog.open(CreateChestCounterDialog,
      {data: {...row, defaultPointSystem: this.defaultPointSystem}}
    );
  }
}


@Component({
  selector: 'create-chest-counter-dialog',
  templateUrl: 'create-chest-counter-dialog.html',
  standalone: false
})
export class CreateChestCounterDialog implements OnInit {

  readonly dialogRef = inject(MatDialogRef<CreateChestCounterDialog>);
  readonly data = inject<ChestCounter>(MAT_DIALOG_DATA);
  hide = signal(true);
  readonly backend = inject(BackendService)
  levelMap = [
    {
      title: 'Casual clan',
      subtitle: 'All crypt/citadel types and levels  \n' +
        'recommended minimal score is 500 points'
    },
    {
      title: 'Competitive clan',
      subtitle: 'Include only crypts/citadels level 15+\n' +
        'recommended minimal score is 7k points'
    },
    {
      title: 'Skilled clan',
      subtitle: 'Include only crypts/citadels level 25+\n' +
        'recommended minimal score is 15k points'
    }
  ]
  @ViewChild(TaskSetupComponent) taskSetup!: TaskSetupComponent;
  inputForm = new FormGroup({
    clanName: new FormControl(this.data?.clanName || '', Validators.required),
    clanTag: new FormControl(this.data?.clanTag || '', {
      validators: [Validators.required],
      asyncValidators: [ClanNameValidatorDirective.create(this.data?.clanTag, this.backend)]
    }),
    kingdom: new FormControl(this.data?.kingdom || '', Validators.required),
    username: new FormControl(this.data?.username || '', Validators.required),
    password: new FormControl(this.data?.password || '', Validators.required),


    minScore: new FormControl(this.data?.minScore || '', Validators.required),
    minEpicCryptCount: new FormControl(this.data?.minEpicCryptCount || '', Validators.required),
    level: new FormControl(this.data?.level || 0, Validators.required),
  });
  pointSystem: PointSystem[] = this.data?.pointSystem || this.data?.defaultPointSystem || [];
  tasks: GenericTask[] = this.data?.tasks || [];

  ngOnInit(): void {
    const level = this.inputForm.get('level')?.value || 0
    console.log('level', level)
    if (level > 2 || level < 0) {
      this.inputForm.get('level')?.setValue(0)
    }
  }

  get pointSystemFormatted(): string {
    const level = this.inputForm.get('level')?.value || 0
    return this.pointSystem.filter(x => {
      switch (level) {
        case 0:
          return true
        case 1:
          return +(/\d+/.exec(x.sourceName) || 0) >= 15
        case 2:
          return +(/\d+/.exec(x.sourceName) || 0) >= 25
        default:
          return false
      }
    }).map(x => x.sourceName.padEnd(30, '.') + x.points.toString().padStart(3, '.'))
      .join('\n')
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  clickEvent(event: MouseEvent) {
    console.log(this.data)
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit() {
    const value = this.inputForm.getRawValue() as any as ChestCounter;
    const tasks = this.taskSetup.rows.getRawValue()
    const payload = {...value, tasks}
    this.backend.createChestCounter(payload).subscribe(() => this.dialogRef.close())
  }

  formatLabel(value: number): string {
    return ['A', 'B', 'C'][value]
  }

}
