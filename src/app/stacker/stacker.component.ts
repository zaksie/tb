import {Component} from '@angular/core';
import {Squad, Troop} from "../models/troop.model";
import {Dictionary, groupBy} from "lodash";
import {Store} from "@ngrx/store";
import {State} from "../store/state.reducer";
import {COOKIE_BONUSES, COOKIE_TROOP_CONFIG, mercenaries, TroopColors, troops} from '../troops.data';
import {bonusesStringDefault, calculateStack} from "./stacker";
// @ts-ignore
const YAML = require('yaml')

@Component({
    selector: 'app-stacker',
    templateUrl: './stacker.component.html',
    styleUrls: ['./stacker.component.scss'],
    standalone: false
})
export class StackerComponent {
  protected readonly troops: Squad[] = troops.map(t => new Squad(t, true));

  tiersDict: Dictionary<Squad[]> = {}
  totalDamage!: number;
  protected readonly TroopColors = TroopColors;
  leadership: number = 0;
  dominance: number = 0;
  selectedLevels: string[] = [];
  protected readonly troopLevelGuardsmen = ['G5', 'G6', 'G7', 'G8', 'G9']
  protected readonly troopLevelSpecialists = ['S5', 'S6', 'S7', 'S8', 'S9']
  protected readonly troopLevelMonsters = ['M5', 'M6', 'M7','M8', 'M9']
  attackType: 'epic' | 'cp' = 'epic';
  public readonly mercenaryList = mercenaries
  bonusesString: string
  constructor(private store: Store<State>) {
    // this.bonuses$ = this.store.select(selectBonuses).pipe(
    //     tap(bonuses => this.bonuses = bonuses),
    //     tap(x => console.log('bonuses updates successfully!', x)),
    //     catchError(err => of([]))
    // )
    const bonuses = this.loadConfig(COOKIE_BONUSES, true)
    const troopConfig = this.loadConfig(COOKIE_TROOP_CONFIG)
    try {
      const obj = JSON.parse(troopConfig)
      this.leadership = obj.leadership
      this.dominance = obj.dominance
      this.selectedLevels = obj.selectedLevels
      this.attackType = obj.attackType
    } catch {
    }
    this.bonusesString = bonuses ? bonuses : bonusesStringDefault
  }

  calculateStacks() {
    this.saveConfig()
    const bonusesObj = YAML.parse(this.bonusesString)

    console.log(bonusesObj)
    const armyLevels = this.selectedLevels.filter(x => x.startsWith('G') || x.startsWith('S'))
    const monsterLevels = this.selectedLevels.filter(x => x.startsWith('M'))
    const armySquads = calculateStack(armyLevels, bonusesObj, this.leadership)
    const monsterSquads: Squad[] = []//calculateStack(monsterLevels, bonusesObj, this.dominance, this.attackType, armySquads[0])
    this.tiersDict = groupBy([...armySquads, ...monsterSquads], x => x.troop.levelId)
  }

  prettify(value: Squad[]): string[] {
    return value.map(s => s.troop.name + ': ' + s.count)
  }

  saveConfig() {
    document.cookie = COOKIE_BONUSES + '=' + JSON.stringify(this.bonusesString)
    document.cookie = COOKIE_TROOP_CONFIG + '=' + JSON.stringify({
      attackType: this.attackType,
      leadership: this.leadership,
      dominance: this.dominance,
      selectedLevels: this.selectedLevels
    })
  }

  replacements: { [key: string]: string } = {'\\\\': '\\', '\\n': '\n', '\\"': ''};

  loadConfig(cookieName: string, unescape = false): string {
    const s0 = document.cookie.split(';')
    const s1 = s0.filter(x => x.trimStart().startsWith(cookieName))
    if (s1.length) {
      const str = s1[0].substring(s1[0].indexOf('=') + 1).trim()
      if (unescape)
        return this.slashUnescape(str)
      return str
    }
    return ''
  }

  slashUnescape(contents: string) {
    return contents.replace(/\\(\\|n|")/g, (replace) => {
      return this.replacements[replace];
    }).replaceAll('"', '');
  }
}

