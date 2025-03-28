import {AfterViewInit, Component, inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AuthService} from "@auth0/auth0-angular";
import {filter, switchMap} from "rxjs";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {FormControl, Validators} from "@angular/forms";

export interface AppGenericDialogData {
  title: string
  content: string[]
  iframeUrl: string
  input: {
    value: string | number | undefined;
    type: 'text'
    title: string
    icon: string
  }
  action: 'login' | 'return'
}

@Component({
  selector: 'app-generic-dialog',
  standalone: false,
  templateUrl: './app-generic-dialog.html',
  styleUrl: './app-generic-dialog.scss'
})
export class AppGenericDialog implements AfterViewInit, OnInit {
  readonly defaultData = {
    title: 'This feature requires login',
    content: ['Do you want to proceed to login?']
  }
  readonly dialogRef = inject(MatDialogRef<AppGenericDialog>);
  readonly data = inject<AppGenericDialogData>(MAT_DIALOG_DATA);
  readonly authService = inject(AuthService)
  mypreview!: SafeResourceUrl;
  myinput = new FormControl(this.data.input.value, Validators.required);
  constructor(public sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.mypreview = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.iframeUrl);
    console.log('data', this.data)
  }

  ngAfterViewInit(): void {
    this.data.title = this.data.title || this.defaultData.title;
    this.data.content = this.data.content || this.defaultData.content;
  }

  login() {
    this.authService.loginWithPopup().pipe(
      switchMap(() => this.authService.isAuthenticated$),
      filter(x => x)
    ).subscribe(() => this.dialogRef.close(true))
  }

  done() {
    if (this.data.action === 'return'){
      //TODO: throw error if invalid
      this.data.input.value = this.myinput.value as string
      return this.dialogRef.close(this.data)
    }
    else return this.login()
  }

  getNoText() {
    switch (this.data.action) {
      case 'return':
        return 'Cancel'
      case 'login':
        return 'No thanks'
    }
  }
}
