import {ChestCounterStatus} from "../models/clan-data.model";

export interface CryptConfig {
  scheduled: boolean;
  status: ChestCounterStatus;
  username: string
  password: string
  kingdom: number
  clanTag: string
  total: number
  total_done: number
  low: number
  high: number
  epic: boolean
  common: boolean
  rare: boolean
  start: number
  end: number
  timezone: string
}
