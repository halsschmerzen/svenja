import type { Entity } from "./Entity";
import type { Relationship } from "./Relationship";

export interface Attribute {
    id: number;
    name: string;
    x: number;
    y: number;
    connectedTo : Entity | Relationship | Attribute;
    isPrimary: boolean;
    isMultivalue: boolean;
    isCalculated: boolean;
    subattributes?: Attribute[];
}