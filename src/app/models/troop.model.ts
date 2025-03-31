import {getMainDivision, getSecondaryDivision, secondaryDivisions, TroopType} from "./troop-type";
import {ConscriptionType} from "./conscription-type";
import {Bonus} from "./bonus.model";
import {flying, guardsman, specialist} from "./troop-type";



export class Troop {
  healthBonus: number = 0;
  strengthBonus: number = 0;
  featureBonus: number = 0;
  _doubleStrength: boolean = false;
  private romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

  get doubleStrength(): boolean {
    return this._doubleStrength
  }

  set doubleStrength(value: boolean) {
    if (this.types.includes(TroopType.Specialist))
      this._doubleStrength = value
  }

  constructor(public name: string,
              public types: TroopType[],
              public strength: number,
              public health: number,
              public conscriptionType: ConscriptionType,
              public level: number,
              public bonuses: Bonus[] = [],
              public conscriptionWeight: number = 1,
              public cost: number = 0
  ) {
  }

  get totalStrength(): number {
    return this.strength * (this.strengthBonus / 100 + 1) * (this.doubleStrength ? 2 : 1)
  }

  get weightedTotalStrength(): number {
    return this.strength * ((this.strengthBonus + this.featureBonus) / 100 + 1) * (this.doubleStrength ? 2 : 1) / this.conscriptionWeight
  }

  get totalHealth(): number {
    return this.health * (this.healthBonus / 100 + 1)
  }

  get allTypes(): string {
    return this.types.map(x => TroopType[x]).join(', ')
  }

  get id(): string {
    return [this.name, this.allTypes, this.level, ConscriptionType[this.conscriptionType]].join(' | ')
  }

  get levelRoman(): string {
    return this.romanNumerals[this.level - 1]
  }

  get mainDivision(): string {
    return getMainDivision(this.types, 'full')
  }

  get secondaryDivision(): string {
    return getSecondaryDivision(this.types)

  }

  get levelId(): string {
    if (this.types.includes(TroopType.Guardsman))
      return 'G' + this.level
    else if (this.types.includes(TroopType.Specialist))
      return 'S' + this.level
    else if (this.types.includes(TroopType.Monster))
      return 'M' + this.level
    else if (this.types.includes(TroopType.EngineerCorps))
      return 'E' + this.level

    else return 'N/A'
  }

  resetBonuses() {
    this.healthBonus = 0
    this.strengthBonus = 0
  }
}

const newTroop = () => {
  return new Troop('', [], 0, 0, ConscriptionType.Authority, 0, [], 0)
}

export interface TroopBonusData {
  health: { [key: string]: number }
  strength: { [key: string]: number }
}

export interface TroopBonusDataBasic {
  health: number
  strength: number
}

export interface BonusesObject {
  epic: TroopBonusDataBasic
  army: TroopBonusDataBasic|undefined;

  [key: string]: TroopBonusDataBasic|undefined;
}

export class Squad {
  private bonuses!: BonusesObject;

  get image(): string {
    return `assets/troops/${this.troop.mainDivision.toLowerCase()}.${this.troop.levelRoman}.${this.troop.secondaryDivision.toLowerCase()}.png`
  }

  constructor(public troop: Troop = newTroop(), public selected: boolean = false, public leadershipCount = 0) {
  }

  get name() {
    return this.troop.name
  }

  get count() {
    return Math.floor(this.leadershipCount / this.troop.conscriptionWeight)
  }

  get totalHealth(): number {
    return this.troop.totalHealth * this.count
  }

  get totalStrength(): number {
    return this.troop.totalStrength * this.count
  }

  get strikeIndex(): number {
    return this.totalStrength * this.totalHealth
  }


  setBonuses(bonuses: BonusesObject) {
    if (!bonuses) return;
    this.adjustBonuses(bonuses)
    this.bonuses = bonuses
    this.troop.resetBonuses()

    this.troop.strengthBonus += bonuses.epic?.strength || 0
    this.troop.healthBonus += bonuses.army?.health || 0
    this.troop.strengthBonus += bonuses.army?.strength || 0

    const featureBonus = this.troop.bonuses.filter(b => secondaryDivisions.includes(b.against))
        .map(b => b.bonus)
        .reduce((acc, x) => acc + x)
      / 4
    console.log(`for troop of type ${this.troop.name} total feature bonus is: ${featureBonus}`)
    this.troop.featureBonus = featureBonus
    this.troop.types.forEach(x => {
      const name: string = TroopType[x].toLowerCase()
      if (name in bonuses) {
        this.troop.healthBonus += +(bonuses[name]?.health || 0)
        this.troop.strengthBonus += +(bonuses[name]?.strength || 0)
      }
      if (name === 'beast') {
        this.troop.healthBonus += 100
        this.troop.strengthBonus += 100
      }
    })

  }

  private adjustBonuses(bonuses: BonusesObject) {

    if (flying in bonuses){
      bonuses.army = {strength:0, health: 0}
      bonuses[guardsman] = undefined
      bonuses[specialist] = undefined
    }
    else if (guardsman in bonuses && specialist in bonuses){
      bonuses.army = {strength:0, health: 0}
    }
  }
}

