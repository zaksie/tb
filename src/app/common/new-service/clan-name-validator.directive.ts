import {Directive} from '@angular/core';
import {map, Observable, of, switchMap, timer} from 'rxjs';
import {AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors} from "@angular/forms";
import {BackendService} from "../../services/backend.service";

@Directive({
  selector: '[clanNameValidator]',
  providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: ClanNameValidatorDirective, multi: true}],
  standalone: false
})
export class ClanNameValidatorDirective implements AsyncValidator {
  currentClanTag: string = '';

  constructor(private backendService: BackendService) {
  }

  static create(currentClanTag: string, backendService: BackendService): (control: AbstractControl) => Observable<ValidationErrors | null> {
    const v = new ClanNameValidatorDirective(backendService);
    console.log('creating ClanNameValidatorDirective with ' + currentClanTag);
    v.currentClanTag = currentClanTag;
    return v.validate.bind(v)
  }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    console.log('validating ClanNameValidatorDirective with ', this.currentClanTag, control.value);
    if (!control.value) return of({error: 'Cannot be blank and must be unique'})
    if (!!this.currentClanTag && this.currentClanTag === control.value) return of(null)
    return timer(500).pipe(
      switchMap(() => this.backendService.checkClanTagAvailable(control.value)),
      map(res => res ? null : {error: 'Tag is already taken'})
    )
  }
}
