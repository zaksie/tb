import {AfterViewInit, Component} from '@angular/core';
import {Bonuses} from "../models/bonuses";
import {TroopType} from "../models/troop-type";
import {Store} from "@ngrx/store";
import {State} from "../store/state.reducer";
import {SET_BONUSES} from "../store/state.actions";
import {MatSelectChange} from "@angular/material/select";
import {v4 as uuidv4} from 'uuid';
import {COOKIE_BONUSES} from "../troops.data";

export interface BonusProfile {
    name: string
    bonuses: Bonuses[]
}


type Profiles = { [key: string]: BonusProfile }


@Component({
    selector: 'app-bonuses',
    templateUrl: './bonuses.component.html',
    styleUrls: ['./bonuses.component.scss'],
    standalone: false
})
export class BonusesComponent implements AfterViewInit {
    selectedProfile!: string
    profiles: Profiles = {}
    private submitted: boolean = false;
    readonly NEW_PROFILE = 'New Profile'

    constructor(private store: Store<State>) {
        try {
            const s0 = document.cookie.split(';')
            const s1 = s0.filter(x => x.trimStart().startsWith(COOKIE_BONUSES))
            const s2 = s1[0].substring(s1[0].indexOf(':') + 1).trim()
            const savedModel: Profiles = JSON.parse(s2)
            console.log({savedModel})
            this.profiles = savedModel
            this.selectedProfile = Object.keys(this.profiles)[0]
            // this.model.forEach(b => b.assignFrom(savedModel))
            this.propogateData()
        } catch (e) {
            this.addNewProfile()
            console.error(e)
        }
    }

    onSubmit() {
      try {
        this.submitted = true
        document.cookie = COOKIE_BONUSES + ':' + JSON.stringify(this.profiles)
        this.propogateData()
      }catch{}
    }

    private propogateData() {
        const bonuses: Bonuses[] = this.profiles[this.selectedProfile].bonuses

        const payload = {bonuses}
        console.log('payload:', payload)
        this.store.dispatch({type: SET_BONUSES, payload})
    }

    getNewModel() {
        return [
            new Bonuses(0, 0, [TroopType.Flying, TroopType.Guardsman]),
            new Bonuses(0, 0, [TroopType.Ranged, TroopType.Guardsman]),
            new Bonuses(0, 0, [TroopType.Melee, TroopType.Guardsman]),
            new Bonuses(0, 0, [TroopType.Mounted, TroopType.Guardsman]),
            new Bonuses(0, 0, [TroopType.Flying, TroopType.Specialist]),
            new Bonuses(0, 0, [TroopType.Ranged, TroopType.Specialist]),
            new Bonuses(0, 0, [TroopType.Melee, TroopType.Specialist]),
            new Bonuses(0, 0, [TroopType.Mounted, TroopType.Specialist])
        ]
    }

    ngAfterViewInit(): void {
    }

    onSelectionChange($event: MatSelectChange) {
        this.selectedProfile = $event.value
        console.log('selectedProfile:', this.profiles[this.selectedProfile])
    }

    addNewProfile() {
        this.selectedProfile = uuidv4()
        this.profiles[this.selectedProfile] = {
            name: this.NEW_PROFILE,
            bonuses: this.getNewModel()
        }
    }

}
