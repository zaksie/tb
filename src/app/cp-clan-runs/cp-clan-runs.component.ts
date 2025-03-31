import {Component} from '@angular/core';
import {Squad, Troop} from "../models/troop.model";
import {troops} from "../troops.data";
import {TroopType} from "../models/troop-type";
import {MatSelectChange} from "@angular/material/select";
import {ConscriptionType} from "../models/conscription-type";

const MILLION = Math.pow(10, 6)
const BILLION = Math.pow(10, 9)
let isSubset = (set1: Set<any>, set2: Set<any>): boolean => [...set1].every(val => set2.has(val));
const flyingTroopSet = new Set([TroopType.Flying])

export interface CPRunResult {
    cpPerPlayer: number;
    targetBirdCount: number,
    squads: Squad[],
    healthBonus?: number,
    health?: number,
    targetDamagePerHit?: number,
    participantNumber?: number,
    cost?: number,
    targetBirdCount1?: number,
    targetBirdCount2?: number
}

@Component({
    selector: 'app-cp-clan-runs',
    templateUrl: './cp-clan-runs.component.html',
    styleUrls: ['./cp-clan-runs.component.scss'],
    standalone: false
})
export class CpClanRunsComponent {
    costPer1k: number = 0;
    revivalCostReduction: number = 0;
    cp: number = 0;
    flyingTroopTypes: Troop[] = troops.filter(x => isSubset(flyingTroopSet, new Set(x.types)) && x.conscriptionType === ConscriptionType.Leadership);
    regularTroops: Troop[] = troops.filter(x => x.conscriptionType === ConscriptionType.Leadership && !x.types.includes(TroopType.EngineerCorps));
    participantNumber: number = 0;
    healthBonus: number = 0;
    selectedTroopType!: Troop
    maxCp = 10 * 1000 * 1000;
    result!: CPRunResult
    avgAttackerBonus: number = 0;

    onSubmit() {
        console.log('submitted')
        this.result = this.calculateSquads()
    }

    formatLabel(value: number): string {
        if (value <= 1000) {
            return Math.round(value) + 'k';
        } else if (value <= 1000 * 1000) {
            return Math.round(value / 100) / 10 + 'M';
        } else {
            return Math.round(value / 100000) / 10 + 'B';
        }
    }

    onSelectionChange($event: MatSelectChange) {
        this.selectedTroopType = $event.value
    }

    private calculateSquads(): CPRunResult {
        const targetDamagePerHit = this.cp * 92 * 1000
        const targetBirdCount = targetDamagePerHit / (this.selectedTroopType.health * (1 + this.healthBonus / 100)) * this.participantNumber
        const targetBirdCount1 = targetBirdCount + 0.25 * targetBirdCount * 8
        const targetBirdCount2 = 0.75 * targetBirdCount * 8
        return {
            squads: this.regularTroops.filter(x => x.types.includes(TroopType.Ranged)).map(t =>
                new Squad(t, true, targetDamagePerHit / (t.strength * (1 + this.avgAttackerBonus / 100)))
            ),
            targetBirdCount,
            targetDamagePerHit,
            healthBonus: this.healthBonus,
            health: this.selectedTroopType.health,
            participantNumber: this.participantNumber,
            cost: this.selectedTroopType.cost * targetBirdCount1 + this.selectedTroopType.cost / this.revivalCostReduction * targetBirdCount2,
            targetBirdCount1,
            targetBirdCount2,
            cpPerPlayer: this.cp * 9

        }
    }
}
