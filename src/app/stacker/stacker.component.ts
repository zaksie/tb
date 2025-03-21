import {Component, signal} from '@angular/core';
import {Squad} from "../models/troop.model";
import {Dictionary} from "lodash";
import {COOKIE_TROOP_CONFIG, mercenaries, TroopColors, troops} from '../troops.data';
import {calculateStack, SetupType} from "./stacker";
import YAML from 'yaml'
import {MatRadioChange} from "@angular/material/radio";
import {setupTypes, TroopConfig} from "./stacker-data";

// @ts-ignore


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
  protected readonly TroopColors = TroopColors;
  protected readonly troopLevelGuardsmen = ['G5', 'G6', 'G7', 'G8', 'G9']
  protected readonly troopLevelSpecialists = ['S5', 'S6', 'S7', 'S8', 'S9']
  protected readonly troopLevelMonsters = ['M5', 'M6', 'M7', 'M8', 'M9']
  public readonly mercenaryList = mercenaries
  troopConfig: TroopConfig
  readonly SetupType = SetupType
  public monacoLoaded = signal(false)

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
    this.saveConfig()
    const bonusesObj = YAML.parse(this.troopConfig.getActiveBonusConfig())

    console.log(bonusesObj)
    const armyLevels = this.troopConfig.selectedLevels.filter(x => x.startsWith('G') || x.startsWith('S'))
    // const monsterLevels = this.troopConfig.selectedLevels.filter(x => x.startsWith('M'))
    const armySquads = calculateStack(armyLevels, bonusesObj, this.troopConfig.leadership)
    // const monsterSquads: Squad[] = []//calculateStack(monsterLevels, bonusesObj, this.dominance, this.attackType, armySquads[0])
    // this.tiersDict = groupBy([...armySquads, ...monsterSquads], x => x.troop.levelId)
    this.troopList = armySquads.sort((a,b) => b.troop.strength - a.troop.strength)
  }

  saveConfig() {
    document.cookie = COOKIE_TROOP_CONFIG + '=' + JSON.stringify(this.troopConfig)
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

  radioChange($event: MatRadioChange) {
    this.troopConfig.selectedSetupType = $event.value
  }

  protected readonly setupTypes = setupTypes;


}

