import {AfterViewInit, Component, EventEmitter, inject, Input, NgZone, OnInit, Output} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {PlatformService} from "../../services/platform.service";
import {BackendService} from "../../services/backend.service";
import {filter, of, switchMap, take, tap} from "rxjs";
import {catchError} from "rxjs/operators";
import {Plan, pricing, Pricing, PricingContext} from '../../account/account.model';


@Component({
  selector: 'app-pricing',
  standalone: false,
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss',
  // host: {ngSkipHydration: 'true'},
})
export class PricingComponent implements AfterViewInit, OnInit {
  isAuthenticated: boolean = false
  selectedPlan: Plan = Plan.None;
  readonly ngZone = inject(NgZone)
  @Output() planchange = new EventEmitter<{ plan: Plan }>()
  @Input() plan!: string;

  private readonly auth = inject(AuthService)
  readonly platform = inject(PlatformService)
  readonly dialog = inject(MatDialog);

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
    // this.ngZone.runOutsideAngular(() => {
    if (!this.plan)
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
      ).subscribe((res: { plan: string }) => {
        console.log(res)
        if (res && res.plan)
          this.selectedPlan = Plan[res.plan as keyof typeof Plan]
      })
    // })
  }

  ngOnInit(): void {
    if (this.plan) {
      this.selectedPlan = this.plan as Plan
    }
  }

  login(plan: Plan) {
    // const dialogRef = this.dialog.open(AppGenericDialog,
    //   {
    //     height: '400px',
    //     width: '600px',
    //     data: {
    //       title: 'Terms & Conditions',
    //       iframeUrl: '/assets/terms.html',
    //     }
    //   }
    // );

    // dialogRef.afterClosed().subscribe(yes => {
    //   if (yes)
    //     ....
    // })
    this.auth.isAuthenticated$.pipe(
      take(1),
      switchMap(isAuthenticated => isAuthenticated ? of(null) : this.auth.loginWithPopup()),
      switchMap(() => this.backend.setPlan(Plan[plan]))
    ).subscribe(() => {
      this.selectedPlan = plan
      this.planchange.emit({plan})
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

  getTierAction(tier: Plan) {
    return {
      title: 'START',
      tier,
      onclick: () => this.login(tier),
    }
  }

  protected readonly Plan = Plan;
}
