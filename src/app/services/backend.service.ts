import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {
  ChestAgg,
  ChestCounter, ContactRequest, DashboardTask, DashboardTaskRaw, NULL_DASHBOARD_TASK,
  PointSystem
} from "../models/clan-data.model";
import {map, mergeMap, Observable, of, Subject, take, tap} from "rxjs";
import {MercExchange} from "../merc-exchange/merc-exchange.model";
import {CryptConfig} from "../crypts-explorer/crypts.model";

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  readonly dashboards$: Subject<ChestAgg[]> = new Subject<ChestAgg[]>();

  constructor(private httpClient: HttpClient) {
  }

  getByClanName(clanName: string): Observable<ChestAgg[]> {
    return this.httpClient.get<ChestAgg[]>(environment.backend + '/api/v1/chests/' + clanName)
  }

  getTrackPlayersList(): Observable<ChestAgg[]> {
    console.log('calling dashboards')
    return this.httpClient.get<ChestAgg[]>(environment.backend + '/api/v1/dashboards').pipe(
      tap(data => this.dashboards$.next(data))
    )
  }

  getDashboardTasks(clanName: string | null, playerName: string | null): Observable<DashboardTask> {
    if (!clanName || !playerName) return of(NULL_DASHBOARD_TASK)
    return this.httpClient.get<DashboardTaskRaw>(environment.backend + `/api/v1/dashboards/tasks/${clanName}/${playerName}`)
      .pipe(
        map((res: DashboardTaskRaw) => {
          const epicCryptCount = res.chests
            .filter(chest => chest.sourceName.includes(' epic crypt'))
            .reduce((agg, chest) => agg + chest.chestCount, 0)
          const score = res.chests.reduce((agg, chest) => {
            const points = res.pointSystem.find(ps => ps.sourceName === chest.sourceName)?.points || 0
            return agg + chest.chestCount * points
          }, 0)
          const scoreGoal = res.requirements[0].minScore
          const epicCryptCountGoal = res.requirements[0].minEpicCryptCount
          return {
            epicCryptCount,
            epicCryptCountGoal,
            score,
            scoreGoal
          }
        })
      )
  }

  getChestCounters() {
    return this.httpClient.get<ChestCounter[]>(environment.backend + '/api/v1/chest-counter')
  }

  createChestCounter(value: ChestCounter) {
    return this.httpClient.post(environment.backend + '/api/v1/chest-counter', value)
  }

  getDefaultPointSystem() {
    return this.httpClient.get<PointSystem[]>(environment.backend + '/api/v1/source-rule')
  }

  getInstanceName(username: string) {
    return this.httpClient.get(environment.backend + '/api/v1/chest-counter/instance-name', {params: {username}, responseType: 'text'})
  }

  startChestCounter(username: string) {
    return this.getInstanceName(username).pipe(mergeMap(name =>
      this.httpClient.post(environment.backend + `/api/v1/chest-counter/${name}/start`, {})))
  }

  stopChestCounter(username: string) {
    return this.getInstanceName(username).pipe(mergeMap(name =>
      this.httpClient.post(environment.backend + `/api/v1/chest-counter/${name}/stop`, {})))
  }

  deleteChestCounter(username: string) {
    return this.getInstanceName(username).pipe(mergeMap(name =>
      this.httpClient.delete(environment.backend + `/api/v1/chest-counter/${name}`, {})))
  }


  ///////////////////////

  trackPlayer(row: ChestAgg) {
    return this.httpClient.post(environment.backend + '/api/v1/dashboards/' + row.clanName + '/' + row.playerName, {})
  }

  untrackPlayer(row: ChestAgg) {
    return this.httpClient.delete(environment.backend + '/api/v1/dashboards/' + row.clanName + '/' + row.playerName)
  }

  checkClanNameAvailable(clanName: string) {
    return this.httpClient.put(environment.backend + '/api/v1/chest-counter/clan-name-available', {clanName})
  }

  createContactRequest(value: ContactRequest) {
    return this.httpClient.post(environment.backend + '/contact-us', value)
  }

  getMercExchanges() {
    return this.httpClient.get<MercExchange[]>(environment.backend + '/api/v1/merc-exchange')
  }
  //////////////////////

  submitCryptConfig(body: CryptConfig) {
    return this.httpClient.post(environment.backend + '/api/v1/crypts', body)
  }

  getCryptExplorers() {
    return this.httpClient.get<CryptConfig[]>(environment.backend + '/api/v1/crypts')
  }

  startCryptExplorer(username: string) {
    return this.getInstanceName(username).pipe(mergeMap(name =>
      this.httpClient.post(environment.backend + `/api/v1/crypts/${name}/start`, {})))
  }

  stopCryptExplorer(username: string) {
    return this.getInstanceName(username).pipe(mergeMap(name =>
      this.httpClient.post(environment.backend + `/api/v1/crypts/${name}/stop`, {})))
  }

  deleteCryptExplorer(username: string) {
    return this.getInstanceName(username).pipe(mergeMap(name =>
      this.httpClient.delete(environment.backend + `/api/v1/crypts/${name}`, {})))
  }
}
