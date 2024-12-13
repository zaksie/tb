import {Squad, Troop} from "./models/troop.model";
import {TroopType, TroopType as tt} from "./models/troop-type";
import {ConscriptionType as ct} from "./models/conscription-type";
import {Bonus} from "./models/bonus.model";
export const COOKIE_BONUSES = 'TBStackBonuses.v10'
export const COOKIE_TROOP_CONFIG = 'TBStackTroopConfig.v2'

export enum TroopColors {
    white = 1,
    green,
    blue,
    purple,
    orange,
    red,
    yellow,
    silver,
    darkgreen,
}

export const guardsmen: Troop[] = [
    new Troop('Archer I', [tt.Human, tt.Ranged, tt.Guardsman], 50, 150, ct.Leadership, 1,
        [
            new Bonus(TroopType.Flying, 67),
            new Bonus(TroopType.Melee, 52)
        ]),
    new Troop('Spearman I', [tt.Human, tt.Melee, tt.Guardsman], 50, 150, ct.Leadership, 1,
        [
            new Bonus(TroopType.Beast, 80),
            new Bonus(TroopType.Mounted, 39)
        ]),
    new Troop('Rider I', [tt.Human, tt.Mounted, tt.Guardsman], 100, 300, ct.Leadership, 1,
        [
            new Bonus(TroopType.All, 5, 'double damage chance'),
            new Bonus(TroopType.Ranged, 65),
            new Bonus(TroopType.SiegeEngine, 54),
        ], 2),

    new Troop('Archer II', [tt.Human, tt.Ranged, tt.Guardsman], 90, 270, ct.Leadership, 2,
        [
            new Bonus(TroopType.Flying, 101),
            new Bonus(TroopType.Melee, 78)
        ]),
    new Troop('Spearman II', [tt.Human, tt.Melee, tt.Guardsman], 90, 270, ct.Leadership, 2,
        [
            new Bonus(TroopType.Beast, 120),
            new Bonus(TroopType.Mounted, 59)
        ]),
    new Troop('Rider II', [tt.Human, tt.Mounted, tt.Guardsman], 180, 540, ct.Leadership, 2,
        [
            new Bonus(TroopType.All, 5, 'double damage chance'),
            new Bonus(TroopType.Ranged, 98),
            new Bonus(TroopType.SiegeEngine, 81),
        ], 2),

    new Troop('Archer III', [tt.Human, tt.Ranged, tt.Guardsman], 160, 480, ct.Leadership, 3,
        [
            new Bonus(TroopType.Flying, 151),
            new Bonus(TroopType.Melee, 117)
        ]),
    new Troop('Spearman III', [tt.Human, tt.Melee, tt.Guardsman], 160, 480, ct.Leadership, 3,
        [
            new Bonus(TroopType.Beast, 180),
            new Bonus(TroopType.Mounted, 88)
        ]),
    new Troop('Rider III', [tt.Human, tt.Mounted, tt.Guardsman], 320, 960, ct.Leadership, 3,
        [
            new Bonus(TroopType.All, 5, 'double damage chance'),
            new Bonus(TroopType.Ranged, 146),
            new Bonus(TroopType.SiegeEngine, 122),
        ], 2),

    new Troop('Archer IV', [tt.Human, tt.Ranged, tt.Guardsman], 290, 870, ct.Leadership, 4,
        [
            new Bonus(TroopType.Flying, 226),
            new Bonus(TroopType.Melee, 176)
        ]),
    new Troop('Spearman IV', [tt.Human, tt.Melee, tt.Guardsman], 290, 870, ct.Leadership, 4,
        [
            new Bonus(TroopType.Beast, 270),
            new Bonus(TroopType.Mounted, 132)
        ]),
    new Troop('Rider IV', [tt.Human, tt.Mounted, tt.Guardsman], 580, 1740, ct.Leadership, 4,
        [
            new Bonus(TroopType.All, 5, 'double damage chance'),
            new Bonus(TroopType.Ranged, 219),
            new Bonus(TroopType.SiegeEngine, 182),
        ], 2),

    new Troop('Archer V', [tt.Human, tt.Ranged, tt.Guardsman], 520, 1560, ct.Leadership, 5,
        [
            new Bonus(TroopType.Flying, 339),
            new Bonus(TroopType.Melee, 263)
        ]),
    new Troop('Spearman V', [tt.Human, tt.Melee, tt.Guardsman], 520, 1560, ct.Leadership, 5,
        [
            new Bonus(TroopType.Beast, 405),
            new Bonus(TroopType.Mounted, 197)
        ]),
    new Troop('Rider V', [tt.Human, tt.Mounted, tt.Guardsman], 1050, 3150, ct.Leadership, 5,
        [
            new Bonus(TroopType.All, 5, 'double damage chance'),
            new Bonus(TroopType.Ranged, 329),
            new Bonus(TroopType.SiegeEngine, 273),
        ], 2),
    new Troop('Battle griffin V', [tt.Flying, tt.Guardsman, tt.Beast], 10000, 30000, ct.Leadership, 5,
        [
            new Bonus(TroopType.Fortification, 208),
            new Bonus(TroopType.Mounted, 395)
        ], 20, 6.17),


    new Troop('Heavy arbalester VI', [tt.Human, tt.Ranged, tt.Guardsman], 940, 2820, ct.Leadership, 6,
        [
            new Bonus(TroopType.Flying, 509),
            new Bonus(TroopType.Melee, 395)
        ]),
    new Troop('Heavy halberdier VI', [tt.Human, tt.Melee, tt.Guardsman], 940, 2820, ct.Leadership, 6,
        [
            new Bonus(TroopType.Beast, 608),
            new Bonus(TroopType.Mounted, 296)
        ]),
    new Troop('Mounted knight VI', [tt.Human, tt.Mounted, tt.Guardsman], 1900, 5700, ct.Leadership, 6,
        [
            new Bonus(TroopType.All, 5, 'double damage chance'),
            new Bonus(TroopType.Ranged, 494),
            new Bonus(TroopType.SiegeEngine, 410),
        ], 2),
    new Troop('Battle griffin VI', [tt.Flying, tt.Guardsman, tt.Beast], 19000, 57000, ct.Leadership, 6,
        [
            new Bonus(TroopType.Fortification, 311),
            new Bonus(TroopType.Mounted, 592)
        ], 20, 7.29),

/////////-------------

    new Troop('Heavy arbalester VII', [tt.Human, tt.Ranged, tt.Guardsman], 1700, 5100, ct.Leadership, 7,
        [
            new Bonus(TroopType.Flying, 763),
            new Bonus(TroopType.Melee, 592)
        ]),
    new Troop('Heavy halberdier VII', [tt.Human, tt.Melee, tt.Guardsman], 1700, 5100, ct.Leadership, 7,
        [
            new Bonus(TroopType.Beast, 911),
            new Bonus(TroopType.Mounted, 444)
        ]),
    new Troop('Mounted knight VII', [tt.Human, tt.Mounted, tt.Guardsman], 3400, 10200, ct.Leadership, 7,
        [
            new Bonus(TroopType.All, 5, 'double damage chance'),
            new Bonus(TroopType.Ranged, 740),
            new Bonus(TroopType.SiegeEngine, 615),
        ], 2),
    new Troop('Battle griffin VII', [tt.Flying, tt.Guardsman, tt.Beast], 34000, 102000, ct.Leadership, 7,
        [
            new Bonus(TroopType.Fortification, 467),
            new Bonus(TroopType.Mounted, 888)
        ], 20, 8.41),

    new Troop('Purifier I', [tt.Human, tt.Ranged, tt.Guardsman], 3060, 9180, ct.Leadership, 8,
        [
            new Bonus(TroopType.Flying, 1145),
            new Bonus(TroopType.Melee, 888)
        ]),
    new Troop('Punisher I', [tt.Human, tt.Melee, tt.Guardsman], 3060, 9180, ct.Leadership, 8,
        [
            new Bonus(TroopType.Beast, 1367),
            new Bonus(TroopType.Mounted, 667)
        ]),
    new Troop('Smiter I', [tt.Human, tt.Mounted, tt.Guardsman], 6120, 18360, ct.Leadership, 8,
        [
            new Bonus(TroopType.All, 5, 'double damage chance'),
            new Bonus(TroopType.Ranged, 1111),
            new Bonus(TroopType.SiegeEngine, 923),
        ], 2),
    new Troop('Corax I', [tt.Human, tt.Flying, tt.Guardsman], 61200, 183600, ct.Leadership, 8,
        [
            new Bonus(TroopType.Fortification, 701),
            new Bonus(TroopType.Mounted, 1333)
        ], 20, 9.53),
    new Troop('Purifier II', [tt.Human, tt.Ranged, tt.Guardsman], 5510, 16530, ct.Leadership, 9,
        [
            new Bonus(TroopType.Flying, 1717),
            new Bonus(TroopType.Melee, 1333)
        ]),
    new Troop('Punisher II', [tt.Human, tt.Melee, tt.Guardsman], 5510, 16530, ct.Leadership, 9,
        [
            new Bonus(TroopType.Beast, 2050),
            new Bonus(TroopType.Mounted, 1000)
        ]),
    new Troop('Smiter II', [tt.Human, tt.Mounted, tt.Guardsman], 11020, 33060, ct.Leadership, 9,
        [
            new Bonus(TroopType.All, 5, 'double damage chance'),
            new Bonus(TroopType.Ranged, 1667),
            new Bonus(TroopType.SiegeEngine, 1384),
        ], 2),
    new Troop('Corax II', [tt.Human, tt.Flying, tt.Guardsman], 110200, 330600, ct.Leadership, 9,
        [
            new Bonus(TroopType.Fortification, 1051),
            new Bonus(TroopType.Mounted, 1999)
        ], 20, 9.53),
]
export const specialists: Troop[] = [
    //////////////////// S5 ///////////////////////////

    new Troop('Deadshot V', [tt.Human, tt.Ranged, tt.Specialist], 520, 1560, ct.Leadership, 5,
        [
            new Bonus(TroopType.Flying, 170),
            new Bonus(TroopType.Human, 105),
            new Bonus(TroopType.Melee, 132)
        ]),
    new Troop('Swordsman V', [tt.Human, tt.Melee, tt.Specialist], 520, 1560, ct.Leadership, 5,
        [
            new Bonus(TroopType.Beast, 203),
            new Bonus(TroopType.Human, 105),
            new Bonus(TroopType.Mounted, 99)
        ]),
    new Troop('Lion rider V', [tt.Human, tt.Mounted, tt.Specialist], 1050, 3150, ct.Leadership, 5,
        [
            new Bonus(TroopType.Human, 105),
            new Bonus(TroopType.Ranged, 165),
            new Bonus(TroopType.SiegeEngine, 137),
        ], 2),
    new Troop('Vulture V', [tt.Human, tt.Flying, tt.Specialist], 520, 1560, ct.Leadership, 5,
        [
            new Bonus(TroopType.Fortification, 104),
            new Bonus(TroopType.Human, 105),
            new Bonus(TroopType.Mounted, 197)
        ]),

    //////////////////// S6 ///////////////////////////

    new Troop('Deadshot VI', [tt.Human, tt.Ranged, tt.Specialist], 940, 2820, ct.Leadership, 6,
        [
            new Bonus(TroopType.Flying, 254),
            new Bonus(TroopType.Human, 105),
            new Bonus(TroopType.Melee, 197)
        ]),
    new Troop('Heavy knight VI', [tt.Human, tt.Melee, tt.Specialist], 940, 2820, ct.Leadership, 6,
        [
            new Bonus(TroopType.Beast, 304),
            new Bonus(TroopType.Human, 105),
            new Bonus(TroopType.Mounted, 148)
        ]),
    new Troop('Lion rider VI', [tt.Human, tt.Mounted, tt.Specialist], 1900, 5700, ct.Leadership, 6,
        [
            new Bonus(TroopType.Human, 105),
            new Bonus(TroopType.Ranged, 247),
            new Bonus(TroopType.SiegeEngine, 205),
        ], 2),
    new Troop('Vulture VI', [tt.Human, tt.Flying, tt.Specialist], 940, 2820, ct.Leadership, 6,
        [
            new Bonus(TroopType.Fortification, 156),
            new Bonus(TroopType.Human, 105),
            new Bonus(TroopType.Mounted, 296)
        ]),

    //////////////////// S7 ///////////////////////////

    new Troop('Deadshot VII', [tt.Human, tt.Ranged, tt.Specialist], 1700, 5100, ct.Leadership, 7,
        [
            new Bonus(TroopType.Flying, 382),
            new Bonus(TroopType.Melee, 296)
        ]),
    new Troop('Heavy knight VII', [tt.Human, tt.Melee, tt.Specialist], 1700, 5100, ct.Leadership, 7,
        [
            new Bonus(TroopType.Beast, 456),
            new Bonus(TroopType.Mounted, 222)
        ]),
    new Troop('Lion rider VII', [tt.Human, tt.Mounted, tt.Specialist], 3400, 10200, ct.Leadership, 7,
        [
            new Bonus(TroopType.All, 5, 'double damage chance'),
            new Bonus(TroopType.Ranged, 370),
            new Bonus(TroopType.SiegeEngine, 308),
        ], 2),
    new Troop('Vulture VII', [tt.Human, tt.Flying, tt.Specialist], 1700, 5100, ct.Leadership, 7,
        [
            new Bonus(TroopType.Fortification, 234),
            new Bonus(TroopType.Mounted, 444)
        ]),

    //////////////////// S8 ///////////////////////////
    new Troop('Legitimist I', [tt.Human, tt.Ranged, tt.Specialist], 3060, 9180, ct.Leadership, 8,
        [
            new Bonus(TroopType.Flying, 572),
            new Bonus(TroopType.Melee, 444),
        ]),
    new Troop('Duelist I', [tt.Human, tt.Melee, tt.Specialist], 3060, 9180, ct.Leadership, 8,
        [
            new Bonus(TroopType.Beast, 683),
            new Bonus(TroopType.Mounted, 333),
        ]),
    new Troop('Whitemane I', [tt.Human, tt.Mounted, tt.Specialist], 6120, 18360, ct.Leadership, 8,
        [
            new Bonus(TroopType.Ranged, 555),
            new Bonus(TroopType.SiegeEngine, 461),
        ], 2),
    new Troop('Royal Lion I', [tt.Beast, tt.Flying, tt.Specialist], 61200, 183600, ct.Leadership, 8,
        [
            new Bonus(TroopType.Fortification, 350),
            new Bonus(TroopType.Mounted, 667),
        ], 20),
//////////////////// S8 ///////////////////////////
    new Troop('Legitimist II', [tt.Human, tt.Ranged, tt.Specialist], 5510, 16530, ct.Leadership, 9,
        [
            new Bonus(TroopType.Flying, 859),
            new Bonus(TroopType.Melee, 667),
        ]),
    new Troop('Duelist II', [tt.Human, tt.Melee, tt.Specialist], 5510, 16530, ct.Leadership, 9,
        [
            new Bonus(TroopType.Beast, 1025),
            new Bonus(TroopType.Mounted, 500),
        ]),
    new Troop('Whitemane II', [tt.Human, tt.Mounted, tt.Specialist], 11020, 33060, ct.Leadership, 9,
        [
            new Bonus(TroopType.Ranged, 833),
            new Bonus(TroopType.SiegeEngine, 692),
        ], 2),
    new Troop('Royal Lion II', [tt.Beast, tt.Flying, tt.Specialist], 110200, 330600, ct.Leadership, 9,
        [
            new Bonus(TroopType.Fortification, 525),
            new Bonus(TroopType.Mounted, 1000),
        ], 20),
]
export const engineerCorps: Troop[] = [
    new Troop('Catapult I', [tt.Human, tt.EngineerCorps, tt.SiegeEngine], 250, 1500, ct.Leadership, 1, [new Bonus(TroopType.Fortification, 65)], 10),
    new Troop('Catapult II', [tt.Human, tt.EngineerCorps, tt.SiegeEngine], 450, 2700, ct.Leadership, 2, [new Bonus(TroopType.Fortification, 98)], 10),
    new Troop('Catapult III', [tt.Human, tt.EngineerCorps, tt.SiegeEngine], 810, 4860, ct.Leadership, 3, [new Bonus(TroopType.Fortification, 146)], 10),
    new Troop('Catapult IV', [tt.Human, tt.EngineerCorps, tt.SiegeEngine], 1460, 8750, ct.Leadership, 4, [new Bonus(TroopType.Fortification, 219)], 10),
    new Troop('Catapult V', [tt.Human, tt.EngineerCorps, tt.SiegeEngine], 2630, 15800, ct.Leadership, 5, [new Bonus(TroopType.Fortification, 329)], 10),
    new Troop('Siege ballistae VI', [tt.Human, tt.EngineerCorps, tt.SiegeEngine], 4730, 28400, ct.Leadership, 6, [new Bonus(TroopType.Fortification, 494)], 10),
    new Troop('Siege ballistae VII', [tt.Human, tt.EngineerCorps, tt.SiegeEngine], 8500, 51000, ct.Leadership, 7, [new Bonus(TroopType.Fortification, 740)], 10),
]
export const mercenaries: Troop[] = [
    new Troop('Warregal', [tt.Flying, tt.Guardsman, tt.Beast], 220000, 660000, ct.Authority, 10,
        [
            new Bonus(TroopType.Fortification, 1051),
            new Bonus(TroopType.Mounted, 1999)
        ], 20),
    new Troop('Jago', [tt.Flying, tt.Specialist, tt.Beast], 220000, 660000, ct.Authority, 10,
        [
            new Bonus(TroopType.Fortification, 525),
            new Bonus(TroopType.Mounted, 1000)
        ], 20),
    new Troop('Ariel', [tt.SiegeEngine, tt.EngineerCorps, tt.Human], 55000, 330000, ct.Authority, 10,
        [
            new Bonus(TroopType.Fortification, 1667),
        ], 10),
    new Troop('Ariel', [tt.SiegeEngine, tt.EngineerCorps, tt.Human], 55000, 330000, ct.Authority, 10,
        [
            new Bonus(TroopType.Fortification, 1667),
        ], 10),
    new Troop('Highlander', [tt.Ranged, tt.Guardsman, tt.Human], 11000, 33000, ct.Authority, 10,
        [
            new Bonus(TroopType.Flying, 1717),
            new Bonus(TroopType.Melee, 1333),
        ], 1),
    new Troop('Slavic warrior', [tt.Melee, tt.Guardsman, tt.Human], 11000, 33000, ct.Authority, 10,
        [
            new Bonus(TroopType.Beast, 2050),
            new Bonus(TroopType.Mounted, 1000),
        ], 1),
    new Troop('Superior epic monster hunter', [tt.EpicMonsterHunter, tt.Guardsman], 25000, 75000, ct.Authority, 10,
        [
            new Bonus(TroopType.EpicMonster, 1000),
        ], 1),
    new Troop('Quicksand', [tt.Mounted, tt.Guardsman, tt.Human], 22000, 66000, ct.Authority, 10,
        [
            new Bonus(TroopType.Ranged, 1667),
            new Bonus(TroopType.SiegeEngine, 1384),
        ], 1),
    new Troop('Combat anteater leader', [tt.Mounted, tt.Guardsman, tt.JungleGuardian], 11400, 34200, ct.Authority, 10,
        [
            new Bonus(TroopType.SwarmMounted, 4000),
        ], 1),
    new Troop('Chitinous defender leader', [tt.Melee, tt.Guardsman, tt.JungleGuardian], 11200, 33600, ct.Authority, 10,
        [
            new Bonus(TroopType.SwarmMelee, 4000),
        ], 1),
    new Troop('Wasp-man leader', [tt.Flying, tt.Guardsman, tt.JungleGuardian], 10800, 32400, ct.Authority, 10,
        [
            new Bonus(TroopType.SwarmFlying, 4000),
        ], 1),
    new Troop('Grim stalker leader', [tt.Ranged, tt.Guardsman, tt.JungleGuardian], 10600, 31800, ct.Authority, 10,
        [
            new Bonus(TroopType.SwarmRanged, 4000),
        ], 1),
]

export const monsters: Troop[] = [
    new Troop('Water elemental', [tt.Ranged, tt.Elemental], 1900, 5700, ct.Dominance, 3,
        [
            new Bonus(TroopType.Flying, 144),
            new Bonus(TroopType.Melee, 113)
        ], 3),
    new Troop('Battle boar', [tt.Mounted, tt.Beast], 3900, 11700, ct.Dominance, 3,
        [
            new Bonus(TroopType.Flying, 144),
            new Bonus(TroopType.Melee, 113)
        ], 6),
    new Troop('Stone gargoyle', [tt.Flying, tt.Giant], 5200, 15600, ct.Dominance, 3,
        [
            new Bonus(TroopType.Beast, 72),
            new Bonus(TroopType.Melee, 185)
        ], 8),
    new Troop('Emerald dragon', [tt.Flying, tt.Dragon], 4500, 13500, ct.Dominance, 3,
        [
            new Bonus(TroopType.Giant, 72),
            new Bonus(TroopType.Mounted, 185)
        ], 7),

    ////////////////////////////////////////////////

    new Troop('Gorgon medusa', [tt.Ranged, tt.Beast], 12000, 36000, ct.Dominance, 4,
        [
            new Bonus(TroopType.Flying, 108),
            new Bonus(TroopType.Melee, 277)
        ], 10),
    new Troop('Magic dragon', [tt.Ranged, tt.Dragon], 15000, 45000, ct.Dominance, 4,
        [
            new Bonus(TroopType.Melee, 169),
            new Bonus(TroopType.Ranged, 216)
        ], 13),
    new Troop('Many-armed guardian', [tt.Melee, tt.Giant], 13000, 39000, ct.Dominance, 4,
        [
            new Bonus(TroopType.Elemental, 270),
            new Bonus(TroopType.Mounted, 115)
        ], 11),
    new Troop('Ice phoenix', [tt.Flying, tt.Elemental], 17000, 51000, ct.Dominance, 4,
        [
            new Bonus(TroopType.Dragon, 162),
            new Bonus(TroopType.Flying, 223)
        ], 15),

    ////////////////////////////////////////////////

    new Troop('Ettin', [tt.Melee, tt.Giant], 48000, 144000, ct.Dominance, 5,
        [
            new Bonus(TroopType.Fortification, 243),
            new Bonus(TroopType.Mounted, 334)
        ], 23),
    new Troop('Flaming centaur', [tt.Mounted, tt.Elemental], 44000, 132000, ct.Dominance, 5,
        [
            new Bonus(TroopType.Beast, 162),
            new Bonus(TroopType.Ranged, 415)
        ], 21),
    new Troop('Desert vanquisher', [tt.Mounted, tt.Dragon], 42000, 126000, ct.Dominance, 5,
        [
            new Bonus(TroopType.Elemental, 324),
            new Bonus(TroopType.Ranged, 253)
        ], 20),
    new Troop('Fearsome manticore', [tt.Flying, tt.Beast], 46000, 138000, ct.Dominance, 5,
        [
            new Bonus(TroopType.Flying, 253),
            new Bonus(TroopType.Giant, 324)
        ], 22),

    ////////////////////////////////////////////////

    new Troop('Ruby golem', [tt.Melee, tt.Elemental], 130000, 390000, ct.Dominance, 6,
        [
            new Bonus(TroopType.Melee, 486),
            new Bonus(TroopType.Mounted, 380)
        ], 35),
    new Troop('Jungle destroyer', [tt.Melee, tt.Beast], 130000, 390000, ct.Dominance, 6,
        [
            new Bonus(TroopType.Dragon, 243),
            new Bonus(TroopType.Mounted, 623)
        ], 34),
    new Troop('Crystal dragon', [tt.Melee, tt.Dragon], 120000, 360000, ct.Dominance, 6,
        [
            new Bonus(TroopType.Elemental, 608),
            new Bonus(TroopType.Mounted, 258)
        ], 33),
    new Troop('Troll rider', [tt.Giant, tt.Mounted], 110000, 330000, ct.Dominance, 6,
        [
            new Bonus(TroopType.Fortification, 486),
            new Bonus(TroopType.Ranged, 380)
        ], 30),

    ////////////////////G7//////////////////////////

    new Troop('Destructive colossus', [tt.Ranged, tt.Giant], 290000, 870000, ct.Dominance, 7,
        [
            new Bonus(TroopType.Flying, 547),
            new Bonus(TroopType.Melee, 752),
        ], 43),
    new Troop('Wind lord', [tt.Melee, tt.Elemental], 310000, 930000, ct.Dominance, 7,
        [
            new Bonus(TroopType.Dragon, 911),
            new Bonus(TroopType.Mounted, 387)
        ], 45),
    new Troop('Ancient terror', [tt.Mounted, tt.Beast], 280000, 840000, ct.Dominance, 7,
        [
            new Bonus(TroopType.Fortification, 547),
            new Bonus(TroopType.Ranged, 752)
        ], 41),
    new Troop('Black dragon', [tt.Flying, tt.Dragon], 300000, 900000, ct.Dominance, 7,
        [
            new Bonus(TroopType.Beast, 729),
            new Bonus(TroopType.Melee, 570)
        ], 44),

    ////////////////////G8//////////////////////////

    new Troop('Trickster I', [tt.Ranged, tt.Beast], 640000, 1920000, ct.Dominance, 8,
        [
            new Bonus(TroopType.Elemental, 1008),
            new Bonus(TroopType.Flying, 940),
        ], 52),
    new Troop('Kraken I', [tt.Melee, tt.Giant], 670000, 2010000, ct.Dominance, 8,
        [
            new Bonus(TroopType.Beast, 957),
            new Bonus(TroopType.Mounted, 991)
        ], 55),
    new Troop('Devastator I', [tt.Mounted, tt.Dragon], 650000, 1950000, ct.Dominance, 8,
        [
            new Bonus(TroopType.Giant, 667),
            new Bonus(TroopType.Ranged, 1281)
        ], 53),
    new Troop('Fire Phoenix I', [tt.Flying, tt.Elemental], 660000, 1980000, ct.Dominance, 8,
        [
            new Bonus(TroopType.Dragon, 1247),
            new Bonus(TroopType.Melee, 701)
        ], 54),

    ////////////////////G9//////////////////////////

    new Troop('Trickster II', [tt.Ranged, tt.Beast], 1150000, 3450000, ct.Dominance, 9,
        [
            new Bonus(TroopType.Elemental, 1512),
            new Bonus(TroopType.Flying, 1410),
        ], 52),
    new Troop('Kraken II', [tt.Melee, tt.Giant], 1210000, 3630000, ct.Dominance, 9,
        [
            new Bonus(TroopType.Beast, 1435),
            new Bonus(TroopType.Mounted, 1486)
        ], 55),
    new Troop('Devastator II', [tt.Mounted, tt.Dragon], 1170000, 3510000, ct.Dominance, 9,
        [
            new Bonus(TroopType.Giant, 1000),
            new Bonus(TroopType.Ranged, 1922)
        ], 53),
    new Troop('Fire Phoenix II', [tt.Flying, tt.Elemental], 1190000, 3570000, ct.Dominance, 9,
        [
            new Bonus(TroopType.Dragon, 1871),
            new Bonus(TroopType.Melee, 1051)
        ], 54),
]

monsters.forEach(m => m.types.push(TroopType.Monster))
mercenaries.forEach(m => m.types.push(TroopType.Mercenary))
export const troops: Troop[] = [...guardsmen, ...engineerCorps, ...monsters, ...mercenaries]

export function getTier(tier: string): Troop[] {
  const level = +tier.charAt(1)
  if (tier.startsWith('G'))
    return guardsmen.filter(g => g.level === level)
  else if (tier.startsWith('S'))
    return specialists.filter(g => g.level === level)
  else if (tier.startsWith('M'))
    return monsters.filter(g => g.level === level)
  else return []
}

