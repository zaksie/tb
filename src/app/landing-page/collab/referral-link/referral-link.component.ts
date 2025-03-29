import {Component, inject} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BackendService} from "../../../services/backend.service";
import {catchError} from "rxjs/operators";
import {of} from "rxjs";

@Component({
  selector: 'app-referral-link',
  standalone: false,
  templateUrl: './referral-link.component.html',
  styleUrl: './referral-link.component.scss'
})
export class ReferralLinkComponent {
  private backend = inject(BackendService);
  readonly dialogRef = inject(MatDialogRef<ReferralLinkComponent>);
  referralFormGroup: FormGroup = new FormGroup({
    code: new FormControl('', Validators.required),
  });
  errorMsg: string | undefined

  onSubmit() {
    this.backend.linkReferral(this.referralFormGroup.get('code')?.value).pipe(
      catchError(() => {
        this.errorMsg = 'Invalid referral code'
        return of(null)
      })
    ).subscribe(() => {
      // if (res?.affectedRows === 1) //Close anyway
      this.dialogRef.close()
    })
  }

  proceedWithoutReferral() {
    console.log('in proceedWithoutReferral')
    this.backend.linkReferral('ARMAGEDDON').subscribe(() => {
      console.log('DONE!')
      this.dialogRef.close()
    })
  }
}
