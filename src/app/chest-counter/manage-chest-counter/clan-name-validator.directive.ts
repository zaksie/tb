import {Directive, inject} from '@angular/core';
import {map, mergeMap, Observable, of, tap} from 'rxjs';
import {AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors} from "@angular/forms";
import {BackendService} from "../../services/backend.service";
import {CreateChestCounterDialog} from "./manage-chest-counter.component";

@Directive({
  selector: '[clanNameValidator]',
  providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: ClanNameValidatorDirective, multi: true}],
  standalone: false
})
export class ClanNameValidatorDirective implements AsyncValidator {
  currentClanName: string = '';

  constructor(private backendService: BackendService) {
  }

  static create(currentClanName: string, backendService: BackendService): (control: AbstractControl) => Observable<ValidationErrors | null> {
    const v = new ClanNameValidatorDirective(backendService);
    console.log('creating ClanNameValidatorDirective with ' + currentClanName);
    v.currentClanName = currentClanName;
    return v.validate.bind(v)
  }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    console.log('validating ClanNameValidatorDirective with ', this.currentClanName, control.value);
    if (this.currentClanName === control.value) return of(null)
    return this.backendService.checkClanNameAvailable(control.value).pipe(
      tap((res: any) => console.log(res)),
      map((res: any) => +res < 1 ? null : {error: 'Name is already taken'})
    )
  }

}
