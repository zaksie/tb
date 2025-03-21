import {Injectable} from '@angular/core';
import {Troop} from "../models/troop.model";

@Injectable({
  providedIn: 'root'
})
export class OptimizationService {
  constructor() { }

  public convert(src: Troop | undefined, dest: Troop, count: number): number {

    if (typeof(src) === 'undefined') return 0;

    const totalHealth = src.totalHealth * count
    return totalHealth / dest.totalHealth
  }
}
