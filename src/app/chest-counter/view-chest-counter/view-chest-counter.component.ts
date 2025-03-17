import {AfterViewInit, Component, inject, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {BackendService} from "../../services/backend.service";
import {ChestAgg, ChestCounter} from "../../models/clan-data.model";
import {MatTableDataSource} from "@angular/material/table";
import {mergeMap} from "rxjs";

@Component({
  selector: 'app-view-chest-counter',
  templateUrl: './view-chest-counter.component.html',
  styleUrl: './view-chest-counter.component.scss',
  standalone: false
})
export class ViewChestCounterComponent implements AfterViewInit {
  public dataSource = new MatTableDataSource<ChestAgg>([]);
  displayedColumns: string[] = ['track', 'playerName', 'epicCryptCount', 'totalScore', 'chestCount'];

  constructor(private backend: BackendService) {

  }

  @ViewChild(MatSort) sort!: MatSort;
  clanName: string = '';
  isLoading: boolean = false;


  ngAfterViewInit() {
    this.dataSource.sort = this.sort
  }

  find() {
    this.isLoading = true
    this.backend.getByClanName(this.clanName).subscribe(data => this.populateData(data))
  }

  populateData(data: ChestAgg[]) {
    this.isLoading = false
    console.log('data', data)
    this.dataSource.data = data
    this.dataSource.sort = this.sort
  }

  getTotalPlayerCount() {
    return this.dataSource.data.length
  }

  getTotalChestCount() {
    return this.dataSource.data.reduce((agg, x) => agg + x.chestCount, 0)
  }

  toggleTrackPlayer(row: ChestAgg) {
    console.log(row)
    row.tracked = !row.tracked
    if (row.tracked)
      this.backend.trackPlayer(row).pipe(mergeMap(x => this.backend.getTrackPlayersList())).subscribe()
    else
      this.backend.untrackPlayer(row).pipe(mergeMap(x => this.backend.getTrackPlayersList())).subscribe()
  }
}
