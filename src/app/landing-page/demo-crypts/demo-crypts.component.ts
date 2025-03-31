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
  templateUrl: './demo-crypts.component.html',
  styleUrl: './demo-crypts.component.scss'
})
export class DemoCryptsComponent {
  constructor() {
    const titleService = inject(Title)
    titleService.setTitle(titles.demos.crypts);
  }
}
