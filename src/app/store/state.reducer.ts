import {
    Action,
    ActionReducerMap,
    ActionType,
    createFeatureSelector,
    createReducer,
    createSelector,
    on
} from '@ngrx/store';
import {setBonuses, setTroopCount} from './state.actions';
import {Troop, Squad} from "../models/troop.model";
import {Bonuses} from "../models/bonuses";

export interface TroopState {
    troop: Troop | undefined
    count: number
}

export interface BonusesState {
    bonuses: Bonuses[]
}
export interface State {
    troopState: TroopState
    bonusesState: BonusesState
}

export const initialState: State = {
    troopState: {
        troop: undefined,
        count: 0
    },
    bonusesState: {
        bonuses: []
    }
};

export const appReducer = createReducer(initialState,
    on(setTroopCount, (state, {payload}) => {
        return {...state, troopState: payload}
    }),
    on(setBonuses, (state, {payload}) => {
        return {...state, bonusesState: payload}
    })
)

export const selectTroopState = (state: State) => {
    // @ts-ignore
    return state.state.troopState
}
export const selectBonusesState = (state: State) => {
    // @ts-ignore
    return state.state.bonusesState
}
export const selectTroop = createSelector(
    selectTroopState,
    (troopState: TroopState) => troopState.troop
);
export const selectTroopCount = createSelector(
    selectTroopState,
    (troopState: TroopState) => troopState.count
);
export const selectBonuses = createSelector(
    selectBonusesState,
    (bonusesState: BonusesState) => bonusesState.bonuses
);

