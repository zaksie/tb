import {AfterViewInit, Component, inject, model, signal, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {ChestCounter, PointSystem} from "../../models/clan-data.model";
import {BackendService} from "../../services/backend.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ClanNameValidatorDirective} from "./clan-name-validator.directive";
import {MatTableDataSource} from "@angular/material/table";
import {take} from "rxjs";
import {ServiceInterface} from "../../services/service-interface";


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
  isLoading: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(protected backend: BackendService) {
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(CreateChestCounterDialog,
      {data: {defaultPointSystem: this.defaultPointSystem}}
    );

    dialogRef.afterClosed().subscribe(() => {
      this.fetch()
    });
  }


  fetch() {
    this.backend.getChestCounters().pipe(take(1)).subscribe(rows => this.populateData(rows))
  }



  ngAfterViewInit() {
    this.fetch()
    this.backend.getDefaultPointSystem().subscribe(pointSystem => this.defaultPointSystem = pointSystem);
    this.dataSource.paginator = this.paginator;
  }

  populateData(data: ChestCounter[]) {
    this.isLoading = false
    console.log('data', data)
    this.dataSource.data = data
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
export class CreateChestCounterDialog {
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
    console.log(value)
    this.backend.createChestCounter(value).subscribe(() => this.dialogRef.close())
  }

  formatLabel(value: number): string {
    return ['A', 'B', 'C'][value]
  }

}
