import {Component, inject, OnInit, signal, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ChestCounter, GenericTask, PointSystem} from "../../models/clan-data.model";
import {BackendService} from "../../services/backend.service";
import {PlatformService} from "../../services/platform.service";
import {TaskSetupComponent} from "../../chest-counter/manage-chest-counter/task-setup/task-setup.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {catchError} from "rxjs/operators";
import {of} from "rxjs";
import {ClanNameValidatorDirective} from "./clan-name-validator.directive";

@Component({
  selector: 'app-new-service',
  standalone: false,
  templateUrl: './new-service.component.html',
  styleUrl: './new-service.component.scss'
})
export class NewServiceComponent implements OnInit{

  readonly dialogRef = inject(MatDialogRef<NewServiceComponent>);
  readonly data = inject<ChestCounter>(MAT_DIALOG_DATA);
  hide = signal(true);
  readonly backend = inject(BackendService)
  readonly platform = inject(PlatformService)
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
  inputForm1 = new FormGroup({
    clanName: new FormControl(this.data?.clanName || '', Validators.required),
    clanTag: new FormControl(this.data?.clanTag || '', {
      validators: [Validators.required],
      asyncValidators: [ClanNameValidatorDirective.create(this.data?.clanTag, this.backend)]
    }),
    kingdom: new FormControl(this.data?.kingdom || '', Validators.required),
    username: new FormControl(this.data?.username || '', [Validators.required, Validators.email]),
    password: new FormControl(this.data?.password || '', Validators.required),
  })
  inputForm2 = new FormGroup({
    minScore: new FormControl(this.data?.minScore || '', Validators.required),
    minEpicCryptCount: new FormControl(this.data?.minEpicCryptCount || '', Validators.required),
    level: new FormControl(this.data?.level || 0, Validators.required),
  });
  pointSystem: PointSystem[] = this.data?.pointSystem || this.data?.defaultPointSystem || [];
  tasks: GenericTask[] = this.data?.tasks || [];
  isLoading: boolean = false

  ngOnInit(): void {
    const level = this.inputForm2.get('level')?.value || 0
    console.log('level', level)
    if (level > 2 || level < 0) {
      this.inputForm2.get('level')?.setValue(0)
    }
  }

  get pointSystemFormatted(): string {
    const level = this.inputForm2.get('level')?.value || 0
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
    }).map(x => x.sourceName.padEnd(20, '.') + x.points.toString().padStart(3, '.'))
      .join('\n')
  }

  clickEvent(event: MouseEvent) {
    console.log(this.data)
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit() {
    this.isLoading = true
    const value1 = this.inputForm1.getRawValue() as any as ChestCounter;
    const value2 = this.inputForm2.getRawValue() as any as ChestCounter;
    const tasks = this.taskSetup?.rows?.getRawValue() || []
    const payload = {...value1, ...value2, tasks}
    this.backend.createChestCounter(payload).pipe(
      catchError(e => {
        console.error(e)
        this.isLoading = false
        return of(false)
      })
    )
      .subscribe(res => this.dialogRef.close(res))
  }

  formatLabel(value: number): string {
    return ['A', 'B', 'C'][value]
  }

  isTasksValid() {
    return !this.taskSetup || this.taskSetup.fg.valid
  }
}
