<script lang="ts">
    import type { Relationship as RelationshipType } from "../../Types/Relationship";

    export let relationship: RelationshipType;
    export let scale = 1;
    export let offsetX = 0;
    export let offsetY = 0;


    $: entity1 = relationship.entities[0];
    $: entity2 = relationship.entities[1];

    $: entity1CenterX = (entity1.x + 60) * scale + offsetX;
    $: entity1CenterY = (entity1.y + 20) * scale + offsetY;
    $: entity2CenterX = (entity2.x + 60) * scale + offsetX;
    $: entity2CenterY = (entity2.y + 20) * scale + offsetY;

    $: midX = (entity1CenterX + entity2CenterX) / 2;
    $: midY = (entity1CenterY + entity2CenterY) / 2;

    const diamondSize = 40; 
    $: diamondPoints = `
        ${midX},${midY - diamondSize / 2} 
        ${midX + diamondSize / 2},${midY} 
        ${midX},${midY + diamondSize / 2} 
        ${midX - diamondSize / 2},${midY}
    `;
</script>

<svg 
    class="relationship-line" 
    width={window.innerWidth} 
    height={window.innerHeight} 
    style="position: fixed; top: 0; left: 0; pointer-events: none;"
>
    <line 
        x1={midX} 
        y1={midY} 
        x2={entity1CenterX} 
        y2={entity1CenterY} 
        stroke="#333" 
        stroke-width="2" 
        vector-effect="non-scaling-stroke"
    />

    <line 
        x1={midX} 
        y1={midY} 
        x2={entity2CenterX} 
        y2={entity2CenterY} 
        stroke="#333" 
        stroke-width="2" 
        vector-effect="non-scaling-stroke"
    />

    <polygon 
        points={diamondPoints} 
        fill="white" 
        stroke="#333" 
        stroke-width="2"
    />

    <text 
        x={midX} 
        y={midY + 5} 
        text-anchor="middle" 
        font-size="14"
        fill="black"
    >
        {relationship.name || 'has'}
    </text>
</svg>

<style>
    .relationship-line {
        position: absolute;
        width: 100%;
        height: 100%;
        pointer-events: none; 
        z-index: 0; 
    }

    text {
        font-family: Arial, sans-serif;
    }
</style>
