import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {
  ChestAgg,
  ChestCounter,
  ChestCounterResults,
  Clan,
  ContactRequest,
  DashboardTask,
  DashboardTaskRaw,
  PointSystem
} from "../models/clan-data.model";
import {filter, map, mergeMap, Observable, Subject, switchMap, tap} from "rxjs";
import {MercExchange} from "../merc-exchange/merc-exchange.model";
import {CryptConfig} from "../crypts-explorer/crypts.model";
import {ServiceName} from "./service-interface";
import {AuthService, User} from "@auth0/auth0-angular";

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  readonly dashboards$: Subject<ChestAgg[]> = new Subject<ChestAgg[]>();

  constructor(private httpClient: HttpClient, private auth: AuthService) {
    this.auth.isAuthenticated$.pipe(
      filter(x => x),
      switchMap(() => this.getTrackPlayersList())).subscribe()
  }

  getChestViewByClanTag(clanTag: string): Observable<ChestCounterResults> {
    return this.httpClient.get<ChestCounterResults>(environment.backend + '/api/v1/chests/' + clanTag)
  }

  getTrackPlayersList(): Observable<ChestAgg[]> {
    console.log('calling dashboards')
    return this.httpClient.get<ChestAgg[]>(environment.backend + '/api/v1/dashboards/preview').pipe(
      tap(data => this.dashboards$.next(data))
    )
  }

  getDashboardTasks(clanTag: string | null, playerName: string | null): Observable<DashboardTask> {
    if (!clanTag || !playerName) throw new Error('missing clan name');
    return this.httpClient.get<DashboardTaskRaw>(environment.backend + `/api/v1/dashboards/tasks/${clanTag}/${playerName}`)
      .pipe(
        map((res: DashboardTaskRaw) => {
          const epicCryptCount = res.chests
            .filter(chest => chest.sourceName.includes(' epic crypt'))
            .reduce((agg, chest) => agg + chest.chestCount, 0)
          const score = res.chests.reduce((agg, chest) => {
            const points = res.pointSystem.find(ps => ps.sourceName.toLowerCase() === chest.sourceName.toLowerCase())?.points || 0
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
    return this.httpClient.post(environment.backend + '/api/v1/chest-counter', value).pipe(map(_ => true))
  }

  getDefaultPointSystem() {
    return this.httpClient.get<PointSystem[]>(environment.backend + '/api/v1/source-rule')
  }

  getInstanceName(username: string) {
    // chest-counter/instance-name is general endpoint for instancename. doesn't make it unique for chest counter
    return this.httpClient.get(environment.backend + '/api/v1/chest-counter/instance-name', {
      params: {username},
      responseType: 'text'
    })
  }

  startService(serviceName: ServiceName, username: string) {
    return this.getInstanceName(username).pipe(mergeMap(name =>
      this.httpClient.post(environment.backend + `/api/v1/${serviceName}/${name}/start`, {})))
  }

  stopService(serviceName: ServiceName, username: string) {
    return this.getInstanceName(username).pipe(mergeMap(name =>
      this.httpClient.post(environment.backend + `/api/v1/${serviceName}/${name}/stop`, {})))
  }

  deleteService(serviceName: ServiceName, username: string) {
    return this.getInstanceName(username).pipe(mergeMap(name =>
      this.httpClient.delete(environment.backend + `/api/v1/${serviceName}/${name}`)))
  }


  ///////////////////////

  trackPlayer(row: ChestAgg) {
    return this.httpClient.post(environment.backend + '/api/v1/dashboards/preview/' + row.clanTag + '/' + row.playerName, {})
  }

  untrackPlayer(row: ChestAgg) {
    return this.httpClient.delete(environment.backend + '/api/v1/dashboards/preview/' + row.clanTag + '/' + row.playerName)
  }

  checkClanTagAvailable(clanTag: string) {
    return this.httpClient.put<boolean>(environment.backend + '/api/v1/chest-counter/clan-tag-available', {clanTag})
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

  searchForClanTag(term: string) {
    return this.httpClient.get<Clan[]>(environment.backend + '/api/v1/chests/q', {params: new HttpParams().set('term', term)})
  }

  getUserDetails(user: User) {
    return this.httpClient.get<any[]>(environment.backend + '/api/v1/account').pipe(
      map((res: any[]) => ({auth0: user, server: res[0]}))
    )
  }

  setPlan(plan: string) {
    return this.httpClient.post(environment.backend + '/api/v1/account/plan', {plan})
  }
}
