import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

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

}
