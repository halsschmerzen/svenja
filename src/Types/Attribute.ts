import type { Entity } from "./Entity";

export interface Attribute {
    id: number;
    name: string;
    x: number;
    y: number;
    connectedTo : Entity;
    isPrimary: boolean;
    isMultivalue: boolean;
    isCalculated: boolean;
}