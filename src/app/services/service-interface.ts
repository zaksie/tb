import {ChestCounterStatus} from "../models/clan-data.model";

export type ServiceName =  'chest-counter' | 'crypts' | 'merc-exchange' | 'merc-exchange/server'
export type ActionableRow = {
  status: ChestCounterStatus
  username: string
  allowAllActions: boolean
}

export  class ServiceInterface {
  static getStatus(row: ActionableRow) {
    if (ServiceInterface.isBlocked(row))
      return '⚠️'
    if (row.status.restartCount > 2)
      return '‼️'
    return row.status.isRunning ? '✅' : '⏹️'
  }

  static isBlocked(row: ActionableRow) {
    return !row.status.isRunning && row.status.accountRunningAnotherService
  }
}
