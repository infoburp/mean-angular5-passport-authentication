import { Effect } from "./effect.model";
import { Action } from "./action.model";

export class Cause {
    _id: string;
    name: string;
    sentiment: number;
    effect: Effect;
    actions: Action[];
}