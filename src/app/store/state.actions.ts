import {createAction, props} from '@ngrx/store';
import {Troop} from "../models/troop.model";
import {Bonuses} from "../models/bonuses";

export const SET_TROOP_COUNT = 'SET_TROOP_COUNT'
export const SET_BONUSES = 'SET_BONUSES'
export const setTroopCount =
  createAction(SET_TROOP_COUNT, props<{payload: {troop: Troop|undefined, count: number}}>());

export const setBonuses =
    createAction(SET_BONUSES, props<{payload: {bonuses: Bonuses[]}}>());

