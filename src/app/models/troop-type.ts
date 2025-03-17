import {Troop} from "./troop.model";

export enum TroopType {
    All,
    Guardsman,
    Specialist,
    EngineerCorps,
    Human,
    Beast,
    Melee,
    Flying,
    Mounted,
    Ranged,
    Dragon,
    Giant,
    SiegeEngine,
    Fortification,
    Elemental,
    Monster,
    NA,
    EpicMonsterHunter,
    EpicMonster,
    JungleGuardian,
    SwarmMounted,
    SwarmMelee,
    SwarmFlying,
    SwarmRanged,
    Mercenary,
    Player
}

export const mainDivisions: TroopType[] = [TroopType.Guardsman,TroopType.EngineerCorps, TroopType.Specialist, TroopType.Monster, TroopType.Mercenary]
export const secondaryDivisions: TroopType[] = [TroopType.Flying, TroopType.Melee, TroopType.Mounted, TroopType.Ranged]

export const getMainDivision = (tts: TroopType[], format: 'short' | 'full' = 'full') => {
    const tt = tts.find(x => mainDivisions.includes(x))
    if (!tt) return ''
    const res = TroopType[tt as TroopType]
    if (!!res && format === 'short') return res[0]
    return res
}

export const getSecondaryDivision = (tts: TroopType[]) => {
  const tt = tts.find(x => secondaryDivisions.includes(x))
  if (!tt) return ''
  return TroopType[tt as TroopType]
}

