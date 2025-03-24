import {Component, inject} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {MatDialog} from "@angular/material/dialog";
import {AppGenericDialog} from "../../common/app-generic-dialog/app-generic-dialog";


export enum Feature {
  FREE_TRIAL,
  STACK_CALCULATOR,
  CLAN_DASHBOARD,
  PLAYER_DASHBOARD,
  HISTORY,
  CP_FORUM,
  AUTO_CRYPTER,
  CHEST_COUNTER,

}

export interface Pricing {
  name: string
  price: string
  features: Feature[]
  remark?: string
}

function getEnumValueFromString<T extends {}>(enumObj: T, value: string): number | undefined {
  const key = Object.keys(enumObj).find(k => enumObj[k as keyof T] === value);
  return key !== undefined ? Number(key) : undefined;
}


@Component({
  selector: 'app-pricing',
  standalone: false,
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss'
})
export class PricingComponent {
  private authService = inject(AuthService)
  readonly dialog = inject(MatDialog);

  readonly features = [
    {
      type: Feature.FREE_TRIAL,
      name: 'Free 14 day trial'
    }, {
      type: Feature.STACK_CALCULATOR,
      name: 'Stack Calculator'
    },
    {
      type: Feature.CLAN_DASHBOARD,
      name: 'Clan Dashboard',
    },
    {
      type: Feature.PLAYER_DASHBOARD,
      name: 'Player Dashboard',
    },
    {
      type: Feature.HISTORY,
      name: 'History and analysis',
    },
    {
      type: Feature.CP_FORUM,
      name: 'CP Forum',
    },
    {
      type: Feature.AUTO_CRYPTER,
      name: 'Auto Crypter',
    },
    {
      type: Feature.CHEST_COUNTER,
      name: 'Chest Counter'
    }
  ]
  readonly basicFeatures = [
    Feature.FREE_TRIAL,
    Feature.STACK_CALCULATOR,
    Feature.CLAN_DASHBOARD,
    Feature.PLAYER_DASHBOARD,
    Feature.HISTORY,
    Feature.CP_FORUM,
  ]
  readonly pricing: Pricing[] = [
    {
      name: 'Basic Plan',
      price: 'FREE',
      features: [...this.basicFeatures]
    },
    {
      name: 'Crypting Plan',
      price: '10$ / 200 crypts',
      features: [...this.basicFeatures,
        Feature.AUTO_CRYPTER
      ]
    },
    {
      name: 'Deluxe Crypting Plan',
      price: '20$ / week',
      remark: 'Unlimited crypts',
      features: [...this.basicFeatures,
        Feature.AUTO_CRYPTER
      ]
    },
    {
      name: 'Clan Management',
      price: '15$ / week',
      features: [...this.basicFeatures,
        Feature.CHEST_COUNTER
      ]
    },
    {
      name: 'Mega-Deluxe Plan',
      price: '25$ / week',
      remark: 'Unlimited crypts',
      features: [...this.basicFeatures,
        Feature.CHEST_COUNTER,
        Feature.AUTO_CRYPTER,
      ]
    }
  ]

  isIncluded(fkey: number, p: Pricing) {
    // const fkeyNum = getEnumValueFromString(Feature, fkey)
    // return p.features.includes(fkeyNum ?? -1)
    return p.features.includes(fkey)
  }

  login() {
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
        this.authService.loginWithPopup().subscribe(() =>  window.scrollTo(0, 0))
    })
  }
}
