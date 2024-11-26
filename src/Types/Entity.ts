import type { Attribute } from "./Attribute";

export interface Entity {
    id: number;
    name: string;
    x: number;
    y: number;
    isWeak: boolean;
    attributes: Attribute[];
}

