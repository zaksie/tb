import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {BackendService} from "../services/backend.service";
import {MercExchange} from "./merc-exchange.model";
import {concatMap, retry, Subscription, timer} from "rxjs";
import {ActionableRow} from "../services/service-interface";

@Component({
  selector: 'app-merc-exchange',
  standalone: false,
  templateUrl: './merc-exchange.component.html',
  styleUrl: './merc-exchange.component.scss'
})
export class MercExchangeComponent implements AfterViewInit, OnDestroy {
  public dataSource = new MatTableDataSource<MercExchange>([]);
  displayedColumns: string[] = ['timestamp', 'coordinates'];
  pollingHandle!: Subscription
  ROW: ActionableRow = {
    username: 'all',
    status: {
      isDirty: false,
      isRunning: false,
      accountRunningAnotherService: false,
      restartCount: -1
    },
    allowAllActions: true
  }

  constructor(private backend: BackendService) {

  }

  ngOnDestroy(): void {
    this.pollingHandle.unsubscribe()
  }

  ngAfterViewInit() {
    this.startPolling()
  }

  private startPolling(requestInterval = 10000, retryCount = 99999999) {
    this.pollingHandle = timer(0, requestInterval)
      .pipe(
        concatMap(() => this.backend.getMercExchanges()),
        retry({count: retryCount, delay: requestInterval})
      )
      .subscribe(data => this.populateData(data))
  }


  private populateData(data: MercExchange[]) {
    data = data.filter(row => !this.dataSource.data.find(d => d.k === row.k && d.x == row.x && d.y === row.y))
    if (data.length > 0) {
      console.log('data', data)
      let audio = new Audio();
      audio.src = "assets/notification1.wav";
      audio.load();
      audio.play().then();
      this.dataSource.data = data
    }
  }

}
