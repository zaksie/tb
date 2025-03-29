import {AfterViewInit, Component, inject} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {PlatformService} from "../../services/platform.service";
import {BackendService} from "../../services/backend.service";
import {filter, of, switchMap, tap} from "rxjs";
import {catchError} from "rxjs/operators";

export enum Feature {
  FREE_TRIAL,
  STACK_CALCULATOR,
  HISTORY,
  CP_FORUM,
  AUTO_CRYPTER,
  CHEST_COUNTER,
  PRICE_MONTHLY,
  PRICE_YEARLY,
}

export enum Plan {
  FREE,
  BASIC,
  PRO,
  CLAN,
  DELUXE,
  None
}

export interface Pricing {
  type: Feature
  name: string
  plans: Plan[]
  price?: string
  bold?: boolean
  remarks?: { [key: string]: string }
  discounts?: { [key: string]: string }
  actions?: { [key: string]: { title: string, path: string } }
}

@Component({
  selector: 'app-pricing',
  standalone: false,
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss'
})
export class PricingComponent implements AfterViewInit {
  isAuthenticated: boolean = false
  selectedPlan: Plan = Plan.None;

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
        return of ({plan: 'None'})
      })
    ).subscribe(({plan}) => {
      // @ts-ignore
      this.selectedPlan = Plan[plan]
    })
  }

  private readonly auth = inject(AuthService)
  readonly platform = inject(PlatformService)
  readonly dialog = inject(MatDialog);

  readonly Plan = Plan
  readonly tiers: Plan[] = [Plan.FREE, Plan.BASIC, Plan.PRO, Plan.CLAN, Plan.DELUXE]
  readonly tiersMobile1: Plan[] = [Plan.FREE, Plan.BASIC, Plan.PRO]
  readonly tiersMobile2: Plan[] = [Plan.CLAN, Plan.DELUXE]
  displayedColumns: string[] = ['feature', Plan[Plan.FREE], Plan[Plan.BASIC], Plan[Plan.PRO], Plan[Plan.CLAN], Plan[Plan.DELUXE]];
  displayedColumnsMobile1: string[] = ['feature', Plan[Plan.FREE], Plan[Plan.BASIC], Plan[Plan.PRO]];
  displayedColumnsMobile2: string[] = ['feature', Plan[Plan.CLAN], Plan[Plan.DELUXE]];

  readonly DOLLAR = ' $ '
  readonly pricingUSD = [
      {
        name: Plan[Plan.FREE],
        price: 0,
        discount: 0
      },
      {
        name: Plan[Plan.BASIC],
        price: 15,
        discount: 15
      },
      {
        name: Plan[Plan.PRO],
        price: 29,
        discount: 25
      },
      {
        name: Plan[Plan.CLAN],
        price: 39,
        discount: 40
      },
      {
        name: Plan[Plan.DELUXE],
        price: 49,
        discount: 40
      }
    ]
  readonly pricing: Pricing[] = [
    {
      type: Feature.FREE_TRIAL,
      name: 'Free Trial',
      plans: [Plan.BASIC, Plan.PRO, Plan.CLAN, Plan.DELUXE],
    },
    {
      type: Feature.STACK_CALCULATOR,
      name: 'Stack Calculator',
      plans: [Plan.FREE, Plan.BASIC, Plan.PRO, Plan.CLAN, Plan.DELUXE],
    },
    {
      type: Feature.HISTORY,
      name: 'Dashboard, history and analysis',
      plans: [Plan.FREE, Plan.BASIC, Plan.PRO, Plan.CLAN, Plan.DELUXE],
    },
    {
      type: Feature.CP_FORUM,
      name: 'CP Forum',
      plans: [Plan.FREE, Plan.BASIC, Plan.PRO, Plan.CLAN, Plan.DELUXE],
    },
    {
      type: Feature.AUTO_CRYPTER,
      name: 'Auto Crypter',
      plans: [Plan.BASIC, Plan.PRO, Plan.DELUXE],
      remarks:
        {
          BASIC: '400 crypts/mo',
          PRO: 'unlimited crypts',
          DELUXE: 'unlimited crypts',
        }
    },
    {
      type: Feature.CHEST_COUNTER,
      name: 'Chest Counter',
      plans: [Plan.CLAN, Plan.DELUXE],
    },
    {
      type: Feature.PRICE_MONTHLY,
      name: 'Price (monthly)',
      bold: true,
      plans: [Plan.FREE, Plan.BASIC, Plan.PRO, Plan.CLAN, Plan.DELUXE],
      remarks: this.pricingUSD.reduce((acc: any, x) => {
        acc[x.name] = (x.price + this.DOLLAR).padStart(this.DOLLAR.length + 3, ' ')
        return acc
      }, {})
    },
    {
      type: Feature.PRICE_YEARLY,
      name: 'Price (yearly)',
      bold: true,
      plans: [Plan.FREE, Plan.BASIC, Plan.PRO, Plan.CLAN, Plan.DELUXE],
      remarks: this.pricingUSD.reduce((acc: any, x) => {
        acc[x.name] = (Math.floor(x.price * 12 * (1 - x.discount/100)) + this.DOLLAR).padStart(this.DOLLAR.length + 3, ' ')
        return acc
      }, {}),
      discounts: this.pricingUSD.slice(1).reduce((acc: any, x) => {
        acc[x.name] = -x.discount + '%'
        return acc
      }, {})
    }

  ]
  public dataSource = new MatTableDataSource<Pricing>(this.pricing);
  contextMobile1 = {tiers:this.tiersMobile1, displayedColumns:this.displayedColumnsMobile1}
  contextMobile2 = {tiers:this.tiersMobile2, displayedColumns:this.displayedColumnsMobile2}
  context = {tiers:this.tiers, displayedColumns:this.displayedColumns}

  constructor(private backend: BackendService) {
    console.log([this.context, this.contextMobile1, this.contextMobile2])
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
    this.auth.loginWithPopup().subscribe(() => {
      this.backend.setPlan(Plan[plan]).subscribe()
      this.selectedPlan = plan
      window.scrollTo(0, 0)
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

}
