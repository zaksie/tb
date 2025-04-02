// string-list-validator.service.ts
import {Directive, Injectable} from '@angular/core';
import {AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {delay, map} from 'rxjs/operators';
import {BackendService} from "./backend.service";

@Directive({
  selector: '[stringListValidator]',
  providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: StringListValidator, multi: true}],
  standalone: false
})
export class StringListValidator implements AsyncValidator {
  validStrings: string[] = []
  constructor() {
  }
  static create(validStrings: string[]): (control: AbstractControl) => Observable<ValidationErrors | null> {
    const v = new StringListValidator();
    v.validStrings = validStrings
    return v.validate.bind(v)
  }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const value = control.value ? control.value.toLowerCase() : '';

    // Simulate async operation (e.g., API call) with a 500ms delay
    return of(this.checkString(value)).pipe(
      delay(500), // Simulate network delay
      map((isValid) => (isValid ? null : { stringNotInList: true })),
    );
  }

  private checkString(str: string): boolean {
    console.log('checking string ', str)
    return (
      this.validStrings.some((item) => item.toLowerCase() === str) || // Exact match
      this.validStrings.some((item) => item.toLowerCase().includes(str)) // Starts with
    );
  }

  // Optional: Method to update the list dynamically if needed
  setValidStrings(strings: string[]) {
    this.validStrings = strings;
  }
}
