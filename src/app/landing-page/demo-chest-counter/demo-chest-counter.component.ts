import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-demo-chest-counter',
  imports: [
    RouterLink
  ],
  standalone: true,
  templateUrl: './demo-chest-counter.component.html',
  styleUrl: './demo-chest-counter.component.scss'
})
export class DemoChestCounterComponent {

}
