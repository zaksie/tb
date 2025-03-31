import {Component, inject} from '@angular/core';
import {RouterLink} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {titles} from "../../../environments/texts";

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
  constructor() {
    const titleService = inject(Title)
    titleService.setTitle(titles.demos.chestCounter);
  }
}
