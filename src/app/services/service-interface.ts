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
      return '⚠️ BLOCKED'
    if (row.status.restartCount > 2)
      return '‼️ ERROR'
    return row.status.isRunning ? '✅ RUNNING' : '⏹️ STOPPED'
  }

  static isBlocked(row: ActionableRow) {
    return !row.status.isRunning && row.status.accountRunningAnotherService
  }
}
