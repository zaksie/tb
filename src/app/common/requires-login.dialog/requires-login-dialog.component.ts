import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AuthService} from "@auth0/auth0-angular";
import {filter, switchMap, switchMapTo} from "rxjs";

@Component({
  selector: 'app-requires-login-dialog',
  standalone: false,
  templateUrl: './requires-login-dialog.html',
  styleUrl: './requires-login-dialog.component.scss'
})
export class RequiresLoginDialog {
  readonly dialogRef = inject(MatDialogRef<RequiresLoginDialog>);
  readonly data = inject<{}>(MAT_DIALOG_DATA);
  readonly authService = inject(AuthService)

  login() {
    this.authService.loginWithPopup().pipe(
      switchMap(() => this.authService.isAuthenticated$),
      filter(x =>x)
    ).subscribe(() => this.dialogRef.close(true))
  }
}
