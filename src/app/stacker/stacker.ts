import {BonusesObject, Squad} from "../models/troop.model";
import {getTier} from "../troops.data";
import {groupBy} from "lodash";
import {secondaryDivisions, TroopType} from "../models/troop-type";

function transformBonuses(bonusesObj: BonusesObject): void {
  if (+bonusesObj.all_army.health > 0 && +bonusesObj.all_army.strength > 0){
      bonusesObj['guardsman'].health = bonusesObj.all_army.health
      bonusesObj['specialist'].health = bonusesObj.all_army.health
      bonusesObj['guardsman'].strength = bonusesObj.all_army.strength
      bonusesObj['specialist'].strength = bonusesObj.all_army.strength
  }
}

export function calculateStack(selectedLevels: string[], bonusesObj: BonusesObject, size: number, cappingSquad: Squad | undefined = undefined){
  const totalTroopSquads = selectedLevels.length * 4
  const effLeadership = size / totalTroopSquads
  const squads: Squad[] = []
  selectedLevels.forEach(level => {
    const tier = getTier(level).map(x => new Squad(x, true, effLeadership))
    squads.push(...tier)
  })
  transformBonuses(bonusesObj)
  squads.forEach(x => x.setBonuses(bonusesObj))
  squads.sort((a, b) => b.troop.weightedTotalStrength - a.troop.weightedTotalStrength)
  console.log('Ordered by strength: \n' + squads.map(s => s.troop.id).join('\n'))
  let successes = 0
  let iteration = 0;
  while (successes < squads.length - 1) {
    successes = 0
    for (let i = 0; i < squads.length - 1; i++) {
      let success = true
      const w = Math.max(squads[i].troop.conscriptionWeight, squads[i + 1].troop.conscriptionWeight)
      while (squads[i].totalHealth >= squads[i + 1].totalHealth) {
        if (squads[i].leadershipCount - w <= 0)
          break
        squads[i].leadershipCount -= w
        squads[i + 1].leadershipCount += w
        success = false
      }
      while (squads[i].totalStrength >= squads[i + 1].totalStrength) {
        if (squads[i].leadershipCount - w <= 0)
          break
        squads[i].leadershipCount -= w
        squads[i + 1].leadershipCount += w
        success = false
      }
      if (success)
        successes++
    }
    iteration++
    if (iteration % 10000 === 0)
      console.log(`[${iteration}] successes: ${successes}`)
    if (iteration > Math.pow(10, 7)) {
      console.warn(`Failed to find match after ${iteration} iterations`)
      break
    }
    if (!!cappingSquad)
      normalizeResults(squads, cappingSquad as Squad)
  }

  console.log(`[${iteration}] successes: ${successes}`)
  console.log(squads.map(s => (s.troop.name + ':').padEnd(25, ' ') + [s.totalHealth, Math.round(s.troop.healthBonus), Math.round(s.troop.strengthBonus)].join(', ')).join("\n"))
  return squads
}

function normalizeResults(squads: Squad[], cappingSquad: Squad){
  const ratio = squads[0].totalHealth / cappingSquad.totalHealth
  squads.forEach(s => s.leadershipCount /= ratio)
}

export const bonusesStringDefault: string =
  `epic:
    strength: 0
# Fill this
all_army:
  health: 0
  strength: 0
# OR these two
guardsman:
  health: 0
  strength: 0
specialist:
  health: 0
  strength: 0
`
