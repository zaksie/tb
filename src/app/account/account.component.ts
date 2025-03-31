import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AuthService, User} from "@auth0/auth0-angular";
import {filter, Observable, switchMap, tap} from "rxjs";
import {BackendService} from "../services/backend.service";

@Component({
  selector: 'app-account',
  standalone: false,
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountDialog {
  private backend = inject(BackendService);
  readonly defaultData = {
    title: 'This feature requires login',
    content: ['Do you want to proceed to login?']
  }
  readonly dialogRef = inject(MatDialogRef<AccountDialog>);
  readonly data = inject<{}>(MAT_DIALOG_DATA);
  user$: Observable<{ auth0: User, server: any }>;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.user$.pipe(
      filter(x => !!x),
      switchMap(user => this.backend.getUserDetails(user)),
      tap(x => console.log('account', x))
    )
  }

  ngAfterViewInit(): void {
  }

  contactRequest() {
    this.authService.user$.pipe(
      filter(x => !!x),
      switchMap(user => {
        const cr = {name: user.name || '', cityCoords: user.email || ''}
        return this.backend.createContactRequest(cr)
      })
    ).subscribe(() => this.dialogRef.close())
  }

  getDays(server: any) {
    const date1 = new Date(server.creationDate);
    const date2 = new Date();
    const diff = date2.getTime() - date1.getTime()
    console.log(server.creationDate, server.trialLengthDays, diff)
    return server.trialLengthDays - Math.floor(diff / (1000 * 60 * 60 * 24))
  }
}
