import { Component } from '@angular/core';


@Component({
    selector: 'app-chest-counter',
    templateUrl: './chest-counter.component.html',
    styleUrls: ['./chest-counter.component.scss'],
    standalone: false
})
export class ChestCounterComponent {
  displayedColumns: string[] = [];
  dataSource = [];
}
