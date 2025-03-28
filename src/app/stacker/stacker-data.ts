import {SetupType} from "./stacker";

export interface TroopConfig {
  valid: {
    bonus: boolean,
    tier: boolean
  }
  id: number
  leadership: number
  tiers: string[]
  selectedSetupType: SetupType
  bonusConfig: string
  bonusConfigObject?: any
  name: string
}

export interface BonusConfig {
  setupType: SetupType
  bonusConfig: string
}

export const bonusConfigDefaults: BonusConfig[] = [
  {
    setupType: SetupType.FULLY_BALANCED,
    bonusConfig:
      `epic:
  strength: 0
army:
  health: 0
  strength: 0
`
  },
  {
    setupType: SetupType.GUARDSMAN_SPECIALIST_BALANCED,
    bonusConfig:
      `epic:
  strength: 0
guardsman:
  health: 0
  strength: 0
specialist:
  health: 0
  strength: 0
`
  },
  {
    setupType: SetupType.NON_BALANCED,
    bonusConfig:
      `epic:
  strength: 0
ranged:
  health: 0
  strength: 0
melee:
  health: 0
  strength: 0
mounted:
  health: 0
  strength: 0
flying:
  health: 0
  strength: 0
`
  }
]
export const DEFAULT_TROOP_CONFIG = (setupType: SetupType=SetupType.FULLY_BALANCED) => {
  return {
    valid: {
      bonus: false,
      tier: false
    },
    name: 'New Setup',
    id: -setupType,
    leadership: 0,
    tiers: [],
    selectedSetupType: setupType,
    bonusConfig: bonusConfigDefaults.find(x => x.setupType === setupType)?.bonusConfig || '',
  }
}
export const setupTypes = [
  {
    title: 'Entire army',
    value: SetupType.FULLY_BALANCED,
    description: 'Fully researched army mod and monster mod, artifacts/enchantments/gems for entire army.'
  },
  {
    title: 'Guardsman/Specialist',
    value: SetupType.GUARDSMAN_SPECIALIST_BALANCED,
    description: 'Fully researched monster mod, balanced bonuses for guardsman and separately for specialists.'
  },
  {
    title: 'Other',
    value: SetupType.NON_BALANCED,
    description: "If you don't know what to choose, you can fill out the bonuses for each troop type (flying/melee/mounted/ranged)"
  }
]

