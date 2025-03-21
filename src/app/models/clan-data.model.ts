import {FeatureModel} from "../landing-page/feature/feature.model";

export interface Clan {
  id: number
  tag: string
  name: string
  players?: string[]
  kingdom: number
}


export type PlayerSubscriptionFeature = ChestAgg | FeatureModel
export const enrichWithFeature = (ps: ChestAgg): PlayerSubscriptionFeature => {
  const feature: FeatureModel = {
    name: `K${ps?.kingdom} ${ps?.clanTag} / ${ps?.playerName}`,
    path: [`/chests/dashboards/${ps.clanName}/${ps.playerName}`]
  }
  return {...feature, ...ps}
}

export interface DashboardTaskRaw {
  pointSystem: {sourceName: string, points: number}[]
  chests: {sourceName: string, chestCount: number}[]
  requirements: {minScore: number, minEpicCryptCount: number}[]
}

export const NULL_DASHBOARD_TASK = [
  {
    counter: 0,
    goal: 0,
    title: 'Epic Crypts'
  },
  {
    counter: 0,
    goal: 0,
    title: 'Score'
  }
]

export interface GenericTask {
  counter: number
  goal: number
  title: string
  source?: string
}

export interface DashboardTask {
  epicCryptCount: number
  epicCryptCountGoal: number
  score: number
  scoreGoal: number
}

export interface Chest {
  clan: Clan
  playerName: string
  source: string
  score: number
  quantity: number
}

export interface ChestCounterStatus {
  isDirty: boolean;
  isRunning: boolean
  accountRunningAnotherService: boolean
  restartCount: number
}
export interface ChestCounter {
  status: ChestCounterStatus;
  username: string
  password: string
  clanName: string
  clanTag: string
  kingdom: number
  level: 0 | 1 | 2;
  minEpicCryptCount: number;
  minScore: number;
  pointSystem: PointSystem[];
  defaultPointSystem: PointSystem[];
  tasks: GenericTask[]
}


export interface PointSystem {
  clanId: number
  sourceId: number
  sourceName: string
  points: number
}
export interface ChestCounterResults {
  players: ChestAgg[]
  stats: ChestCounter[]
}
export interface ChestAgg {
  chests: { [key: string]: number }
  sources: any[]
  totalScore: number
  epicCryptCount: number
  chestCount: number
  clanName: string
  clanId: number
  clanTag: string
  kingdom: number
  playerName: string
  tracked: boolean
}

export interface ContactRequest {
  cityCoords: string
  message?: string
  name: string
}
