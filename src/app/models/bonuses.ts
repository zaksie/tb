import {Bonus} from "./bonus.model";
import {TroopType} from "./troop-type";

export class Bonuses {
    public name: string
    constructor(
        public healthBonus: number,
        public strengthBonus: number,
        public troopTypes: TroopType[],
    ) {
        this.name = this.troopTypes.map(tt => TroopType[tt]).join(', ')
    }

}
