import {Component, Input, OnInit} from '@angular/core';
import {getMainDivision, TroopType} from "../models/troop-type";
import {Troop, Squad} from "../models/troop.model";
import {TroopColors} from "../troops.data";

@Component({
  selector: 'level-main-division',
  templateUrl: './level-main-division.component.html',
  styleUrls: ['./level-main-division.component.scss']
})
export class LevelMainDivisionComponent implements OnInit{
    @Input() troops!: Squad[];
    @Input() allSelected0!: boolean;


    get mainDivision(): string {
      return getMainDivision(this.troops[0].troop.types)
    }
    get level(): number {
      return this.troops[0].troop.level
    }

    protected readonly TroopColors = TroopColors;
    get background(): string {
        return `linear-gradient(-45deg, ${TroopColors[this.troops[0].troop.level]}, 10%, transparent)`
    }

    ngOnInit(): void {
    }
}
