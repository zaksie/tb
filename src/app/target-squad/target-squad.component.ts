import {Component, EventEmitter, Output} from '@angular/core';
import {Squad} from "../models/troop.model";
import {TroopType} from "../models/troop-type";

@Component({
    selector: 'app-target-squad',
    templateUrl: './target-squad.component.html',
    styleUrls: ['./target-squad.component.scss'],
    standalone: false
})
export class TargetSquadComponent {
    @Output() created: EventEmitter<Squad> = new EventEmitter<Squad>()
    model: Squad = new Squad()
    onSubmit() {
        this.created.emit(this.model)
    }

    protected readonly TroopType: string[] = Object.values(TroopType).map(x => x as string)
}
