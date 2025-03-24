import {AfterViewInit, Component, inject} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {MatDialog} from "@angular/material/dialog";
import {AppGenericDialog} from "../../common/app-generic-dialog/app-generic-dialog";
import {MatTableDataSource} from "@angular/material/table";

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
  DELUXE
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

  ngAfterViewInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated)
  }

  private authService = inject(AuthService)
  readonly dialog = inject(MatDialog);
  readonly Plan = Plan
  readonly tiers: Plan[] = [Plan.FREE, Plan.BASIC, Plan.PRO, Plan.CLAN, Plan.DELUXE]
  displayedColumns: string[] = ['feature', Plan[Plan.FREE], Plan[Plan.BASIC], Plan[Plan.PRO], Plan[Plan.CLAN], Plan[Plan.DELUXE]];

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
      plans: [Plan.BASIC, Plan.PRO, Plan.CLAN, Plan.DELUXE],
      remarks:
        {
          BASIC: 'up to 200 crypts / week',
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
      remarks:
        {
          FREE: ' 0 $',
          BASIC: '15 $',
          PRO: '25 $',
          CLAN: '40 $',
          DELUXE: '50 $',
        }
    },
    {
      type: Feature.PRICE_YEARLY,
      name: 'Price (yearly)',
      bold: true,
      plans: [Plan.FREE, Plan.BASIC, Plan.PRO, Plan.CLAN, Plan.DELUXE],
      remarks:
        {
          FREE: '  0 $',
          BASIC: '153 $',
          PRO: '210 $',
          CLAN: '288 $',
          DELUXE: '300 $',
        },
      discounts:
        {
          BASIC: '15% OFF',
          PRO: '30% OFF',
          CLAN: '40% OFF',
          DELUXE: '50% OFF',
        }
    }

  ]
  public dataSource = new MatTableDataSource<Pricing>(this.pricing);


  login(plan: Plan) {
    const dialogRef = this.dialog.open(AppGenericDialog,
      {
        height: '400px',
        width: '600px',
        data: {
          title: 'Terms & Conditions',
          iframeUrl: '/assets/terms.html',
        }
      }
    );

    dialogRef.afterClosed().subscribe(yes => {
      if (yes)
        this.authService.loginWithPopup().subscribe(() => {
          window.scrollTo(0, 0)
        })
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
