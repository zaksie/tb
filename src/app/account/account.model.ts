import {User} from "@auth0/auth0-angular";

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
  FREE = 'FREE',
  BASIC = 'BASIC',
  PRO = 'PRO',
  CLAN = 'CLAN',
  PREMIUM = 'PREMIUM',
  None = 'None',
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

export interface Order {
  order_id: string,
  payment_id: string,
  closed: boolean,
  username: string
}

export interface ServerUser {
  credit: number;
  paymentsObj: { [key: string]: Order }
  hasCredit: boolean;
  hasPending: boolean;
  cryptQuota: number;
  cryptCount: number;
  quick_links: any[];
  trialLengthDays: number;
  creationDate: string;
  trialDaysLeft: number
  isTrialActive: boolean
  days_left: number
  plan: string
  username: string
}

export interface ExtUser {
  server: ServerUser;
  auth0: User
}

export interface PlanPricing {
  period_in_days?: number;
  name: string
  price: number
  discount: number
}

export const DOLLAR = ' $ '
export const pricingUSD: PlanPricing[] = [
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
    price: 38,
    discount: 40
  },
  {
    name: Plan[Plan.PREMIUM],
    price: 45,
    discount: 40
  }
]
export const pricing: Pricing[] = [
  {
    type: Feature.FREE_TRIAL,
    name: 'Free Trial',
    plans: [Plan.BASIC, Plan.PRO, Plan.CLAN, Plan.PREMIUM],
  },
  {
    type: Feature.STACK_CALCULATOR,
    name: 'Stack Calculator',
    plans: [Plan.FREE, Plan.BASIC, Plan.PRO, Plan.CLAN, Plan.PREMIUM],
  },
  {
    type: Feature.HISTORY,
    name: 'Dashboard, history and analysis',
    plans: [Plan.FREE, Plan.BASIC, Plan.PRO, Plan.CLAN, Plan.PREMIUM],
  },
  {
    type: Feature.CP_FORUM,
    name: 'CP Forum',
    plans: [Plan.FREE, Plan.BASIC, Plan.PRO, Plan.CLAN, Plan.PREMIUM],
  },
  {
    type: Feature.AUTO_CRYPTER,
    name: 'Auto Crypter',
    plans: [Plan.BASIC, Plan.PRO, Plan.PREMIUM],
    remarks:
      {
        BASIC: '400 *',
        PRO: '1000 *',
        PREMIUM: '∞',
      }
  },
  {
    type: Feature.CHEST_COUNTER,
    name: 'Chest Counter',
    plans: [Plan.CLAN, Plan.PREMIUM],
  },
  {
    type: Feature.PRICE_MONTHLY,
    name: 'Price (monthly)',
    bold: true,
    plans: [Plan.FREE, Plan.BASIC, Plan.PRO, Plan.CLAN, Plan.PREMIUM],
    remarks: pricingUSD.reduce((acc: any, x) => {
      acc[x.name] = (x.price + DOLLAR).padStart(DOLLAR.length + 3, ' ')
      return acc
    }, {})
  },
  {
    type: Feature.PRICE_YEARLY,
    name: 'Price (yearly)',
    bold: true,
    plans: [Plan.FREE, Plan.BASIC, Plan.PRO, Plan.CLAN, Plan.PREMIUM],
    remarks: pricingUSD.reduce((acc: any, x) => {
      acc[x.name] = (Math.floor(x.price * 12 * (1 - x.discount / 100)) + DOLLAR).padStart(DOLLAR.length + 3, ' ')
      return acc
    }, {}),
    discounts: pricingUSD.slice(1).reduce((acc: any, x) => {
      acc[x.name] = -x.discount + '%'
      return acc
    }, {})
  }

]


export interface PricingContext {
  tiers: Plan[],
  displayedColumns: string[]
}
