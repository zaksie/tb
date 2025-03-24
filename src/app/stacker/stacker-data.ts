import {SetupType} from "./stacker";

export class TroopConfig {
  leadership: number =0
  dominance?: number = 0
  selectedLevels: string[] = []
  attackType: 'epic' | 'cp' = 'epic'
  selectedSetupType: SetupType = SetupType.NON_BALANCED
  bonusConfigs: BonusConfig[] = bonusConfigDefaults

  constructor() {
  }

  getActiveBonusConfig(): string {
    return this.bonusConfigs.find(x => x.setupType === this.selectedSetupType)?.config || ''
  }
}
export interface BonusConfig {
  setupType: SetupType
  config: string
}


export const bonusConfigDefaults: BonusConfig[] = [
  {
    setupType: SetupType.FULLY_BALANCED,
    config:
      `epic:
  strength: 0
army:
  health: 0
  strength: 0
`
  },
  {
    setupType: SetupType.GUARDSMAN_SPECIALIST_BALANCED,
    config:
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
    config:
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
    title: 'Irregular bonuses',
    value: SetupType.NON_BALANCED,
    description: "If you don't know what to choose, you can fill out the bonuses for each troop type (flying/melee/mounted/ranged)"
  }
]

