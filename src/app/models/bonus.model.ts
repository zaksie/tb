import {TroopType} from "./troop-type";

export class Bonus{
    constructor(public against: TroopType = TroopType.All,
                public bonus: number = 0,
                public bonusType: 'strength' | 'health' | 'double damage chance' = 'strength',
                public selfType: TroopType = TroopType.NA
    ) {
    }

}
