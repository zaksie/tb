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
  templateUrl: './demo-stacker.component.html',
  styleUrl: './demo-stacker.component.scss'
})
export class DemoStackerComponent {
  constructor() {
    const titleService = inject(Title)
    titleService.setTitle(titles.demos.stacker);
  }
}
