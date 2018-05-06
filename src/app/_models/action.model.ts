import { Cause } from "./cause.model";
import { Effect } from "./effect.model";

export class Action {
    _id: string;
    name: string;
    sentiment: number;
    cause: Cause;
    effect: Effect;
}