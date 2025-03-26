import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ClanNameValidatorDirective} from "./clan-name-validator.directive";
import {ChestCounter, GenericTask, PointSystem} from "../../models/clan-data.model";
import {BackendService} from "../../services/backend.service";
import {CommonForm} from "./common.struct";

export class ChestCounterForm extends CommonForm{

  override inputForm2: FormGroup<{
    minEpicCryptCount: FormControl<number | string | null>;
    minScore: FormControl<number | string | null>;
    level: FormControl<1 | 2 | number | null>
  }>;
  pointSystem: PointSystem[]
  tasks: GenericTask[]
  override invalid2(data: {taskSetup: any}): boolean {
    return super.invalid2(data) || !this.isTasksValid(data.taskSetup)
  }
  constructor(data: ChestCounter, backend: BackendService) {
    const clanTagValidators ={
        validators: [Validators.required],
        asyncValidators: [ClanNameValidatorDirective.create(data?.clanTag, backend)]
      }
    super(data, backend, {clanTagValidators})
    this.inputForm2 = new FormGroup({
      minScore: new FormControl(data?.minScore || '', Validators.required),
      minEpicCryptCount: new FormControl(data?.minEpicCryptCount || '0', Validators.required),
      level: new FormControl(data?.level || 0, Validators.required),
    });
    this.pointSystem= data?.pointSystem || data?.defaultPointSystem || [];
    this.tasks = data?.tasks || [];
  }

  static levelMap = [
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
  onInit(){
    const level = this.inputForm2.get('level')?.value || 0
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

  submit(data: {taskSetup: any}){
    const value1 = this.inputForm1.getRawValue() as any as ChestCounter;
    const value2 = this.inputForm2.getRawValue() as any as ChestCounter;
    const tasks = data.taskSetup?.rows?.getRawValue() || []
    const payload = {...value1, ...value2, tasks}
    return this.backend.createChestCounter(payload)
  }

  formatLabel(value: number): string {
    return ['A', 'B', 'C'][value]
  }
  isTasksValid(taskSetup: any) {
    return !taskSetup || taskSetup.fg.valid
  }
}
