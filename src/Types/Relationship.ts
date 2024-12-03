import type { Entity } from "./Entity";
import type { Attribute } from "./Attribute";
export interface Relationship {
    id: number;
    name: string;
    entities: [Entity, Entity];
    relationship_type: '1-1' | '1-N' | 'N-1' | 'N-N'; 
    from_entity: 'can' | 'must';
    to_entity: 'can' | 'must';
    attributes: Attribute[];
    diamondOffsetX?: number; 
    diamondOffsetY?: number;
}
