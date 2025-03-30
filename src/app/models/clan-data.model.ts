import {FeatureModel} from "../landing-page/feature/feature.model";
import {User} from "@auth0/auth0-angular";

export interface Clan {
  id: number
  tag: string
  name: string
  players?: string[]
  kingdom: number
}


export type PlayerSubscriptionFeature = ChestAgg | FeatureModel


export const NULL_DASHBOARD_TASK = {
  mainTasks: [{
    counter: 0,
    goal: 0,
    title: 'Epic Crypts'
  },
    {
      counter: 0,
      goal: 0,
      title: 'Score'
    }]
}

export interface GenericTask {
  counter: number
  goal: number
  title: string
  source?: string
  sources?: string[]
  hash?: string
}

export interface DashboardTasks{
  mainTasks: GenericTask[]
  pointSystem: {sourceName: string, points: number}[]
  chests: {sourceName: string, chestCount: number}[]
  requirements: {minScore: number, minEpicCryptCount: number}[]
  tracked: boolean
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

  pass?: boolean
}

export interface ContactRequest {
  cityCoords?: string
  message?: string
  name: string
}

export interface ExtUser { server: any; auth0: User }
