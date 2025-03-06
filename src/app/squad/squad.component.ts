import {AfterViewInit, Component, Input} from '@angular/core';
import {Troop, Squad} from "../models/troop.model";
import {count, filter, map, Observable, tap, withLatestFrom} from "rxjs";
import {select, Store} from "@ngrx/store";
import {selectTroopState, State} from "../store/state.reducer";
import {OptimizationService} from "../services/optimization.service";
import {SET_TROOP_COUNT, setTroopCount} from "../store/state.actions";

@Component({
    selector: 'app-squad',
    templateUrl: './squad.component.html',
    styleUrls: ['./squad.component.scss'],
    standalone: false
})
export class SquadComponent implements AfterViewInit {
    @Input() troop!: Squad
    private _sliderValue = 0
    get sliderValue(): number {
        return this._sliderValue
    }

    set sliderValue(value: number) {
        this._sliderValue = value
        this.troop.leadershipCount = value
        const payload = {troop: this.troop.troop, count: value}
        this.store.dispatch({type: SET_TROOP_COUNT, payload})
    }

    constructor(private store: Store<State>, public optimizationService: OptimizationService) {

    }

    ngAfterViewInit(): void {
        this.store.select(selectTroopState).pipe(
            filter(selectedTroop => !!selectedTroop.troop),
            filter(selectedTroop => selectedTroop.troop?.id !== this.troop.troop.id),
            map(selectedTroop => this.optimizationService.convert(selectedTroop.troop, this.troop.troop, selectedTroop.count)),
            tap(newCount => {
                this.troop.leadershipCount = this._sliderValue = Math.floor(newCount)
            })

        ).subscribe()
    }
}
