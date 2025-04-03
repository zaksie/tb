import {AfterViewInit, Component, EventEmitter, inject, NgZone, OnInit, Output} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {PlatformService} from "../../services/platform.service";
import {BackendService} from "../../services/backend.service";
import {filter, of, switchMap, take, tap} from "rxjs";
import {catchError} from "rxjs/operators";
import {Plan, PlanDuration, PlanId, pricing, Pricing, PricingContext} from '../../account/account.model';
import {Router} from "@angular/router";


@Component({
  selector: 'app-pricing',
  standalone: false,
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss',
  // host: {ngSkipHydration: 'true'},
})
export class PricingComponent implements AfterViewInit, OnInit {
  isAuthenticated: boolean = false
  readonly ngZone = inject(NgZone)
  @Output() planchange = new EventEmitter<PlanId>()
  planId!: PlanId | undefined;

  private readonly auth = inject(AuthService)
  readonly platform = inject(PlatformService)
  readonly dialog = inject(MatDialog);
  readonly router: Router = inject(Router)
  readonly tiers: Plan[] = [Plan.FREE, Plan.BASIC, Plan.PRO, Plan.CLAN, Plan.PREMIUM]
  readonly tiersMobile1: Plan[] = [Plan.FREE, Plan.BASIC, Plan.PRO]
  readonly tiersMobile2: Plan[] = [Plan.CLAN, Plan.PREMIUM]
  displayedColumns: string[] = ['feature', Plan[Plan.FREE], Plan[Plan.BASIC], Plan[Plan.PRO], Plan[Plan.CLAN], Plan[Plan.PREMIUM]];
  displayedColumnsMobile1: string[] = ['feature', Plan[Plan.FREE], Plan[Plan.BASIC], Plan[Plan.PRO]];
  displayedColumnsMobile2: string[] = ['feature', Plan[Plan.CLAN], Plan[Plan.PREMIUM]];


  public dataSource = new MatTableDataSource<Pricing>(pricing);
  contextMobile1: PricingContext = {tiers: this.tiersMobile1, displayedColumns: this.displayedColumnsMobile1}
  contextMobile2: PricingContext = {tiers: this.tiersMobile2, displayedColumns: this.displayedColumnsMobile2}
  context: PricingContext = {tiers: this.tiers, displayedColumns: this.displayedColumns}

  constructor(private backend: BackendService) {
  }

  ngAfterViewInit(): void {
    this.auth.isAuthenticated$.pipe(
      filter(x => x),
      tap(() => {
        this.isAuthenticated = true
        console.log('getting plan...')
      }),
      switchMap(() => this.backend.getPlan()),
      catchError(error => {
        console.error("Error in PRICING", error)
        return of({plan: 'None'})
      })
    ).subscribe((res: any) => {
      console.log('assigning planId in pricing component', res)
      this.planId = res
    })
  }

  ngOnInit(): void {
  }

  login(planId: PlanId) {
    this.auth.isAuthenticated$.pipe(
      take(1),
      switchMap(isAuthenticated => isAuthenticated ? of(null) : this.auth.loginWithPopup()),
      switchMap(() => this.backend.setPlan(planId).pipe(
        catchError(err => of({error: 'NOT_ENOUGH_CREDITS'}))
      ))
    ).subscribe((res: any) => {
      if (res?.error === 'NOT_ENOUGH_CREDITS')
        this.router.navigate(['/account/payment', {planId: JSON.stringify(planId)}])
      else {
        this.planId = planId
        this.planchange.emit(planId)
      }
    })
  }

  getTableValue(tier: Plan, row: Pricing) {
    if (row.remarks) {
      if (Plan[tier] in row.remarks)
        return row.remarks[Plan[tier]]
    }
    return row.plans.includes(tier) ? '✓' : '-'
  }

  getBadge(tier: Plan, row: Pricing) {
    if (row.discounts) {
      if (Plan[tier] in row.discounts)
        return row.discounts[Plan[tier]]
    }
    return undefined
  }


  protected readonly Plan = Plan;
  protected readonly PlanDuration = PlanDuration;
}
