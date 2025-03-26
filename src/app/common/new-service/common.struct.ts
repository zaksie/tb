import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BackendService} from "../../services/backend.service";
import {Observable} from "rxjs";

export abstract class CommonForm {
  inputForm1!: FormGroup<{
    password: FormControl<string | null>;
    clanTag: FormControl<string | null>;
    kingdom: FormControl<number | string | null>;
    clanName: FormControl<string | null>;
    username: FormControl<string | null>
  }>
  inputForm2: any;

  protected constructor(protected data: any, protected backend: BackendService, options: { clanTagValidators: any }) {
    this.inputForm1 = new FormGroup({
      clanName: new FormControl(data?.clanName || '', Validators.required),
      clanTag: new FormControl(data?.clanTag || '', options.clanTagValidators),
      kingdom: new FormControl(data?.kingdom || '', Validators.required),
      username: new FormControl(data?.username || '', [Validators.required, Validators.email]),
      password: new FormControl(data?.password || '', Validators.required),
    })
  }

  abstract onInit(): void;

  abstract submit(data: any): Observable<any>;

  invalid2(data: any = undefined): boolean {
    return this.inputForm1.invalid || this.inputForm2.invalid
  }

  invalid1(): boolean {
    return this.inputForm1.invalid
  }
}
