import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BackendService} from "../../services/backend.service";
import {CommonForm} from "./common.struct";
import {CryptConfig} from "../../crypts/crypts.model";


export class CryptsForm extends CommonForm {

  override inputForm2: FormGroup<{
    total: FormControl<any>;
    high: FormControl<any>;
    common: FormControl<any>;
    low: FormControl<any>;
    rare: FormControl<any>;
    start: FormControl<any>;
    epic: FormControl<any>;
    end: FormControl<any>
  }>;

  constructor(data: CryptConfig, backend: BackendService) {
    const clanTagValidators = Validators.required
    super(data, backend, {clanTagValidators})
    this.inputForm2 = new FormGroup({
      total: new FormControl(this.data?.total || 0, Validators.required),
      low: new FormControl(this.data?.low || 0, Validators.required),
      high: new FormControl(this.data?.high || 0, Validators.required),
      common: new FormControl(this.data?.common || true, Validators.required),
      rare: new FormControl(this.data?.rare || true, Validators.required),
      epic: new FormControl(this.data?.epic || true, Validators.required),

      start: new FormControl(this.data?.start || 0, Validators.required),
      end: new FormControl(this.data?.end || 0, Validators.required),
    });
  }

  onInit() {
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
