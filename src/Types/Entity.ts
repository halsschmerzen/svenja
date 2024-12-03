import type { Attribute } from "./Attribute";
import type { Relationship } from "./Relationship";

export interface Entity {
    id: number;
    name: string;
    x: number;
    y: number;
    isWeak: boolean;
    attributes: Attribute[];
    relationships: Relationship[];
}

