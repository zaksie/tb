import {Component, inject, OnInit, signal} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {filter, Observable, switchMap, take, tap} from "rxjs";
import {BackendService} from "../services/backend.service";
import {ExtUser} from "../models/clan-data.model";
import {PaymentService} from "../services/payment.service";

type State = 'changePlan' | 'topUpPlan' | 'topUpCrypts' | undefined
@Component({
  selector: 'app-account',
  standalone: false,
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent implements OnInit{
  private backend = inject(BackendService);
  user$!: Observable<ExtUser>;
  state = signal<State>(undefined)
  private paymentService= inject(PaymentService)
  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
        this.initUser()
    }
  initUser(){
    this.user$ = this.authService.user$.pipe(
      filter(x => !!x),
      switchMap(user => this.backend.getUserDetails(user)),
      tap(x => console.log('account', x))
    )
  }

  contactRequest() {
    this.user$.pipe(
      take(1),
      switchMap(user => {
        const cr = {name: user.auth0.name || '', cityCoords: user.auth0.email || ''}
        return this.backend.createContactRequest(cr)
      })
    ).subscribe()
  }

  onChange() {
    this.state.set('changePlan')
  }

  useCredit() {
    this.user$ = this.paymentService.useCredit().pipe(
      switchMap(() => this.authService.user$),
      filter(x => !!x),
      switchMap(user => this.backend.getUserDetails(user))
    )

  }

  topUpCrypts() {

  }

  onTopUpPlanDone($event: any) {

  }
}
