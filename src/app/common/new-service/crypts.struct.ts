import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BackendService} from "../../services/backend.service";
import {CommonForm} from "./common.struct";
import {CryptConfig} from "../../crypts/crypts.model";
import {signal} from "@angular/core";


export class CryptsForm extends CommonForm {
  readonly isScheduled = signal(true)

  override inputForm2: FormGroup<{
    total: FormControl<number>;
    high: FormControl<number>;
    common: FormControl<boolean>;
    low: FormControl<number>;
    rare: FormControl<boolean>;
    start: FormControl<number>;
    scheduled: FormControl<boolean>;
    epic: FormControl<boolean>;
    end: FormControl<number>
  }>

  constructor(data: CryptConfig, backend: BackendService) {
    console.log('received crypt_config', data)
    const clanTagValidators = Validators.required
    super(data, backend, {clanTagValidators})
    this.inputForm2 = new FormGroup({
      total: new FormControl(this.data?.total || 0, Validators.required),
      low: new FormControl(this.data?.low || 1, Validators.required),
      high: new FormControl(this.data?.high || 35, Validators.required),
      common: new FormControl(this.data?.common, Validators.required),
      rare: new FormControl(this.data?.rare, Validators.required),
      epic: new FormControl(this.data?.epic, Validators.required),

      scheduled: new FormControl(this.data?.scheduled, Validators.required),
      start: new FormControl(this.data?.start, Validators.required),
      end: new FormControl(this.data?.end, Validators.required),
    });
  }

  onInit() {
    const scheduledField = this.inputForm2.get('scheduled')
    console.log(scheduledField)
    scheduledField?.valueChanges
      .subscribe((value) => {
        console.log('setting scheduled to ', value)
        this.isScheduled.set(value)
      })
    this.isScheduled.set(scheduledField?.value || false)
  }

  submit(data: { taskSetup: any }) {
    const value1 = this.inputForm1.getRawValue();
    const value2 = this.inputForm2.getRawValue();
    const payload = {...value1, ...value2, timezone: this.getTimezone()} as any as CryptConfig;
    return this.backend.submitCryptConfig(payload)
  }

  formatHourLabel(value: number): string {
    return value.toString().padStart(2, '0') + ':00'
  }

  getTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  }

}
