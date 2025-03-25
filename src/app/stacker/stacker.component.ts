import {Component, signal, ViewChild} from '@angular/core';
import {BonusesObject, Squad} from "../models/troop.model";
import {Dictionary} from "lodash";
import {COOKIE_TROOP_CONFIG, mercenaries, TroopColors, troops} from '../troops.data';
import {calculateStack, SetupType} from "./stacker";
import YAML from 'yaml'
import {MatRadioChange} from "@angular/material/radio";
import {setupTypes, TroopConfig} from "./stacker-data";
import {Subject} from "rxjs";
import {flying, guardsman, melee, mounted, ranged, specialist} from "../models/troop-type";
import {MatStepper} from "@angular/material/stepper";

@Component({
  selector: 'app-stacker',
  templateUrl: './stacker.component.html',
  styleUrls: ['./stacker.component.scss'],
  standalone: false
})
export class StackerComponent {
  protected readonly troops: Squad[] = troops.map(t => new Squad(t, true));
  editorOptions = {
    theme: 'vs-dark',
    language: 'YAML',
    lineNumbers: false,
    fontSize: 18,
    scrollBeyondLastLine: false
  };
  tiersDict: Dictionary<Squad[]> = {}
  troopList: Squad[] = []
  totalDamage!: number;
  errors$ = new Subject<string>()
  protected readonly TroopColors = TroopColors;
  protected readonly troopLevelGuardsmen = ['G5', 'G6', 'G7', 'G8', 'G9']
  protected readonly troopLevelSpecialists = ['S5', 'S6', 'S7', 'S8', 'S9']
  protected readonly troopLevelMonsters = ['M5', 'M6', 'M7', 'M8', 'M9']
  public readonly mercenaryList = mercenaries
  troopConfig: TroopConfig
  readonly SetupType = SetupType
  public monacoLoaded = signal(false)
  @ViewChild(MatStepper) matStepperView!: MatStepper

  constructor() {
    const _troopConfig = this.loadConfig(COOKIE_TROOP_CONFIG)
    try {
      const data = JSON.parse(_troopConfig)
      this.troopConfig = Object.assign(new TroopConfig, data)
    } catch {
      this.troopConfig = new TroopConfig()
    }
  }

  calculateStacks() {
    const bonusesObj = YAML.parse(this.troopConfig.getActiveBonusConfig())
    if (!this.verifyBonuses(bonusesObj)) return;
    this.saveConfig()

    console.log(bonusesObj)
    const armyLevels = this.troopConfig.selectedLevels.filter(x => x.startsWith('G') || x.startsWith('S'))
    // const monsterLevels = this.troopConfig.selectedLevels.filter(x => x.startsWith('M'))
    const armySquads = calculateStack(armyLevels, bonusesObj, this.troopConfig.leadership)
    // const monsterSquads: Squad[] = []//calculateStack(monsterLevels, bonusesObj, this.dominance, this.attackType, armySquads[0])
    // this.tiersDict = groupBy([...armySquads, ...monsterSquads], x => x.troop.levelId)
    this.troopList = armySquads.sort((a,b) => b.troop.strength - a.troop.strength)
  }

  saveConfig() {
    try {
      const bonusesObj = YAML.parse(this.troopConfig.getActiveBonusConfig())
      if (!this.verifyBonuses(bonusesObj)) return;
      document.cookie = COOKIE_TROOP_CONFIG + '=' + JSON.stringify(this.troopConfig)
      this.matStepperView.next()
    }catch{}
  }

  replacements: { [key: string]: string } = {'\\\\': '\\', '\\n': '\n', '\\"': ''};

  loadConfig(cookieName: string, unescape = false): string {
    try {
      const s0 = document.cookie.split(';')
      const s1 = s0.filter(x => x.trimStart().startsWith(cookieName))
      if (s1.length) {
        const str = s1[0].substring(s1[0].indexOf('=') + 1).trim()
        if (unescape)
          return this.slashUnescape(str)
        return str
      }
    }catch{}
    return ''
  }

  slashUnescape(contents: string) {
    return contents.replace(/\\(\\|n|")/g, (replace) => {
      return this.replacements[replace];
    }).replaceAll('"', '');
  }

  radioChange($event: MatRadioChange) {
    this.troopConfig.selectedSetupType = $event.value
  }

  protected readonly setupTypes = setupTypes;

  readonly ERROR_MSG = ` ERROR: Either use 'army' or the 'guardsman/specialist' or the 'ranged/melee/mounted/flying' fields but don't mix them`
  private verifyBonuses(bonusesObj: BonusesObject) {
    if(bonusesObj.army){
      const invalid = guardsman in bonusesObj || specialist in bonusesObj || flying in bonusesObj
      if (invalid) {
        this.errors$.next(this.ERROR_MSG)
        return false
      }
    }
    else if(bonusesObj[guardsman] || bonusesObj[specialist]){
      const invalid = !!bonusesObj.army || flying in bonusesObj
      if (invalid) {
        this.errors$.next(this.ERROR_MSG)
        return false
      }
    }else if(flying in bonusesObj || melee in bonusesObj || mounted in bonusesObj || ranged in bonusesObj){
      const invalid = !!bonusesObj.army || guardsman in bonusesObj || specialist in bonusesObj
      if (invalid) {
        this.errors$.next(this.ERROR_MSG)
        return false
      }
    } else {
      this.errors$.next(` ERROR: Invalid bonuses object. Must include 'epic' field as well as one of the following 'army', 'guardsman/specialist',  'ranged/melee/mounted/flying'`);
      return false;
    }
    this.errors$.next('')
    return true
  }
}

