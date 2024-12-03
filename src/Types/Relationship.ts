import type { Entity } from "./Entity";

export interface Relationship {
    id: number;
    name: string;
    entities: [Entity, Entity];
}
