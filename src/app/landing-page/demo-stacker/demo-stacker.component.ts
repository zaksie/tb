import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

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

}
