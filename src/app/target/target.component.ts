import { Component } from '@angular/core';
import {Squad, Troop} from "../models/troop.model";

@Component({
  selector: 'app-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.scss']
})
export class TargetComponent {
    squads: Squad[] = []
    addNewSquad() {
        this.squads.push(new Squad())
    }
}
