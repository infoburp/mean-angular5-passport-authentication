import { Cause } from "./cause.model";

export class Effect {
    _id: string;
    name: string;
    sentiment: number;
    causes: Cause[];
}