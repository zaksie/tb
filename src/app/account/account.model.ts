
export function findPricingByPlanId(planId: PlanId) {
  return pricingUSD.find(x => x.name === planId.plan && x.period === planId.duration);
}

export interface PlanId {
  plan: Plan
  duration?: PlanDuration
}

export interface Currency {
  logo_full_url: string;
  name: string
  code: string
  logo_url: string
  network: string
  fullname: string
}

export interface Credit {
  credit: number
  hasCredit: boolean
  log: SuccessfulPayment[]
}

export interface SuccessfulPayment {
  days_left: number;
  days_cancel_to_end: number
  days_start_to_end: number
  credit: number
  original_price: number
  payment_id: number
  username: string
  startDate: string
  endDate: string
  discount: number
  price: number
  cancelDate: string
}

export enum Feature {
  FREE_TRIAL,
  STACK_CALCULATOR,
  HISTORY,
  CP_FORUM,
  AUTO_CRYPTER,
  CHEST_COUNTER,
  PRICE_MONTHLY,
  PRICE_QUARTERLY,
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

export enum PlanDuration {
  mo1 = '1 month',
  mo3 = '3 month',
  mo12 = '12 months',
  inf = '∞'
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
  days_left: number;
  isTrialActive: boolean;
  paymentsObj: { [key: string]: Order }
  hasCredit: boolean;
  hasPending: boolean;
  credit_usd: number;
  cryptQuota: number;
  cryptCount: number;
  quick_links: any[];
  trialLengthDays: number;
  creationDate: string;
  trialDaysLeft: number
  daysLeft: number
  planId: PlanId
  username: string
}

export interface PlanPricing {
  total_price: number;
  period: PlanDuration;
  id: string
  name: string
  price: number
  discount: number,
  period_in_days: number
  total_price_per_mo: number
}

export interface PlanPricingBase {
  name: string
  price: number
  discounts: {
    discount: number,
    period: PlanDuration
  } []
}

export const DOLLAR = ' $ '
export const pricingBase: PlanPricingBase[] = [
  {
    name: Plan[Plan.FREE],
    price: 0,
    discounts: [
      {
        period: PlanDuration.inf,
        discount: 0
      }
    ]
  },
  {
    name: Plan[Plan.BASIC],
    price: 15,
    discounts: [
      {
        period: PlanDuration.mo1,
        discount: 0
      },
      {
        period: PlanDuration.mo3,
        discount: 5
      },
      {
        period: PlanDuration.mo12,
        discount: 15
      }
    ]
  },
  {
    name: Plan[Plan.PRO],
    price: 29,
    discounts: [
      {
        period: PlanDuration.mo1,
        discount: 0
      },
      {
        period: PlanDuration.mo3,
        discount: 10
      },
      {
        period: PlanDuration.mo12,
        discount: 25
      }
    ]
  },
  {
    name: Plan[Plan.CLAN],
    price: 38,
    discounts: [
      {
        period: PlanDuration.mo1,
        discount: 0
      },
      {
        period: PlanDuration.mo3,
        discount: 20
      },
      {
        period: PlanDuration.mo12,
        discount: 40
      }
    ]
  },
  {
    name: Plan[Plan.PREMIUM],
    price: 45,
    discounts: [
      {
        period: PlanDuration.mo1,
        discount: 0
      },
      {
        period: PlanDuration.mo3,
        discount: 20
      },
      {
        period: PlanDuration.mo12,
        discount: 40
      }
    ]
  }
]
export const pricingUSD: PlanPricing[] = pricingBase.flatMap(p => p.discounts.map(d => {
  const period_in_days = planDurationToMonth(d.period) * 31
  const total_price_per_mo = p.price * (1 - d.discount / 100)
  return {
    name: p.name,
    id: p.name + d.period,
    price: p.price,
    total_price: period_in_days * total_price_per_mo / 31,
    period_in_days,
    total_price_per_mo,
    discount: d.discount,
    period: d.period
  }
}))

function planDurationToMonth(planDuration: PlanDuration) {
  switch (planDuration) {
    case PlanDuration.mo1:
      return 1
    case PlanDuration.mo3:
      return 3
    case PlanDuration.mo12:
      return 12
    default:
      return 99
    // throw new Error(`Unknown planDuration: ${planDuration}`)
  }
}

function getRemarks(planDuration: PlanDuration) {
  return pricingUSD.reduce((acc: any, x) => {
    acc[x.name] = (Math.floor(x.price * planDurationToMonth(planDuration) * (1 - x.discount/100)) + DOLLAR).padStart(DOLLAR.length + 3, ' ')
    return acc
  }, {})
}
//TODO: is there an issue here?
function getDiscounts(planDuration: PlanDuration) {
  return pricingUSD.slice(1).reduce((acc: any, x) => {
    acc[x.name] = -x.discount + '%'
    return acc
  }, {})
}

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
    type: Feature.PRICE_QUARTERLY,
    name: 'Price (quarterly)',
    bold: true,
    plans: [Plan.FREE, Plan.BASIC, Plan.PRO, Plan.CLAN, Plan.PREMIUM],
    remarks: getRemarks(PlanDuration.mo3),
    discounts: getDiscounts(PlanDuration.mo3),
  },
  {
    type: Feature.PRICE_YEARLY,
    name: 'Price (yearly)',
    bold: true,
    plans: [Plan.FREE, Plan.BASIC, Plan.PRO, Plan.CLAN, Plan.PREMIUM],
    remarks: getRemarks(PlanDuration.mo12),
    discounts: getDiscounts(PlanDuration.mo12),
  }
]


export interface PricingContext {
  tiers: Plan[],
  displayedColumns: string[]
}
