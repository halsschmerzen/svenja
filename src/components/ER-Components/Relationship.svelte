<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { Relationship as RelationshipType } from "../../Types/Relationship";

    const dispatch = createEventDispatcher();

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

    function toggleMultiplicity(end: 'start' | 'end') {
        if (!relationship.relationship_type) return; 

        let [first, second] = relationship.relationship_type.split('-') as ['1' | 'N', '1' | 'N'];

        if (end === 'start') {
            first = first === '1' ? 'N' : '1';
        } else {
            second = second === '1' ? 'N' : '1';
        }

        const updatedType = `${first}-${second}` as '1-1' | '1-N' | 'N-1' | 'N-N'; 
        dispatch('updateType', { 
            relationship: { 
                ...relationship, 
                relationship_type: updatedType 
            } 
        });
    }

    function toggleOptionality(end: 'from' | 'to') {
        if (end === 'from') {
            relationship.from_entity = relationship.from_entity === 'can' ? 'must' : 'can';
        } else {
            relationship.to_entity = relationship.to_entity === 'can' ? 'must' : 'can';
        }
        dispatch('updateType', { 
            relationship: { 
                ...relationship
            } 
        });
    }

    $: angle = Math.atan2(entity2CenterY - entity1CenterY, entity2CenterX - entity1CenterX);
    $: offset = 90; 

    $: fromOptionalX = entity1CenterX + offset * Math.cos(angle);
    $: fromOptionalY = entity1CenterY + offset * Math.sin(angle);

    $: toOptionalX = entity2CenterX - offset * Math.cos(angle);
    $: toOptionalY = entity2CenterY - offset * Math.sin(angle);

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

    <g class="multiplicity" on:click={() => toggleMultiplicity('start')}>
        <rect 
            x={entity1CenterX + 100} 
            y={entity1CenterY - 30} 
            width="20" 
            height="20" 
            fill="rgba(0, 255, 0, 0.3)" 
            class="hover-rect"
        />
        <text 
            x={entity1CenterX - 100} 
            y={entity1CenterY - 20} 
            text-anchor="middle" 
            font-size="14"
            fill="red"
        >
            {relationship.relationship_type.split('-')[0]}
        </text>
    </g>

    <g class="optional-indicator start" on:click={() => toggleOptionality('from')}>
        {#if relationship.from_entity === 'can'}
            <circle 
                cx={fromOptionalX+15} 
                cy={fromOptionalY} 
                r="6" 
                fill="white"
                stroke="black"
                stroke-width="2"
                class="optional-circle"
            />
        {:else}
            <rect 
                x={fromOptionalX + 15} 
                y={fromOptionalY-8} 
                width="12" 
                height="12" 
                fill="transparent"
                class="optional-hover-box"
            />
        {/if}
    </g>

    <g class="multiplicity" on:click={() => toggleMultiplicity('end')}>
        <rect 
            x={entity2CenterX - 100} 
            y={entity2CenterY + 30} 
            width="20" 
            height="20" 
            fill="rgba(0, 255, 0, 0.3)" 
            class="hover-rect"
        />
        <text 
            x={entity2CenterX - 100} 
            y={entity2CenterY - 20} 
            text-anchor="middle" 
            font-size="14"
            fill="blue"
        >
            {relationship.relationship_type.split('-')[1]}
        </text>
    </g>

    <g class="optional-indicator end" on:click={() => toggleOptionality('to')}>
        {#if relationship.to_entity === 'can'}
            <circle 
                cx={toOptionalX-15} 
                cy={toOptionalY} 
                r="6" 
                fill="white" 
                stroke="black"
                stroke-width="2"
                class="optional-circle"
            />
        {:else}
            <rect 
                x={toOptionalX - 15} 
                y={toOptionalY - 6} 
                width="12" 
                height="12" 
                fill="transparent"
                class="optional-hover-box"
            />
        {/if}
    </g>

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

    .multiplicity {
        cursor: pointer;
        pointer-events: all; 
    }

    .multiplicity .hover-rect {
        display: none;
    }

    .multiplicity:hover .hover-rect {
        display: block;
    }

    .optional-indicator {
        cursor: pointer;
        pointer-events: all;
    }

    .optional-hover-box {
        cursor: pointer;
    }

    .optional-indicator.start:hover .optional-hover-box,
    .optional-indicator.end:hover .optional-hover-box {
        fill: rgba(0, 255, 0, 0.3);
        stroke: green;
        stroke-width: 1;
    }

    text {
        font-family: Arial, sans-serif;
        user-select: none;
    }

    rect {
        pointer-events: all; 
    }

    circle {
        cursor: pointer;
        pointer-events: all;
    }
</style>
