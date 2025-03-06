import { Component } from '@angular/core';


@Component({
  selector: 'app-chest-counter',
  templateUrl: './chest-counter.component.html',
  styleUrls: ['./chest-counter.component.scss']
})
export class ChestCounterComponent {
  displayedColumns: string[] = [];
  dataSource = [];
}
