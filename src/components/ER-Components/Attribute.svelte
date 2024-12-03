<script lang="ts">
    import type { Attribute as AttributeType} from "../../Types/Attribute";

    export let attribute: AttributeType;
    export let scale = 1;
    export let offsetX = 0;
    export let offsetY = 0;

    type Point = { x: number; y: number };
    let connectionStart: Point = { x: 0, y: 0 };

    let isDragging = false;
    let startX: number;
    let startY: number;
    let attributeStartX = 0;
    let attributeStartY = 0;

    function handleMouseDown(event: MouseEvent) {
        isDragging = true;
        const isRelationship = 'entities' in attribute.connectedTo;
        if (isRelationship) {
            startX = event.clientX;
            startY = event.clientY;
            attributeStartX = attribute.x;
            attributeStartY = attribute.y;
        } else {
            startX = event.clientX - ((attribute.connectedTo.x + attribute.x) * scale + offsetX);
            startY = event.clientY - ((attribute.connectedTo.y + attribute.y) * scale + offsetY);
        }
    }

    function handleMouseMove(event: MouseEvent) {
        if (!isDragging) return;
        const isRelationship = 'entities' in attribute.connectedTo;
        if (isRelationship) {
            const deltaX = (event.clientX - startX) / scale;
            const deltaY = (event.clientY - startY) / scale;
            attribute.x = attributeStartX + deltaX;
            attribute.y = attributeStartY + deltaY;
        } else {
            attribute.x = (event.clientX - startX - offsetX) / scale - attribute.connectedTo.x;
            attribute.y = (event.clientY - startY - offsetY) / scale - attribute.connectedTo.y;
        }
    }

    function handleMouseUp() {
        isDragging = false;
    }

    $: {
        const isRelationship = 'entities' in attribute.connectedTo;
        if (isRelationship) {
            const relationship = attribute.connectedTo;
            const entity1CenterX = (relationship.entities[0].x + 60) * scale + offsetX;
            const entity1CenterY = (relationship.entities[0].y + 20) * scale + offsetY;
            const entity2CenterX = (relationship.entities[1].x + 60) * scale + offsetX;
            const entity2CenterY = (relationship.entities[1].y + 20) * scale + offsetY;

            const baseX = (entity1CenterX + entity2CenterX) / 2 + (relationship.diamondOffsetX || 0) * scale;
            const baseY = (entity1CenterY + entity2CenterY) / 2 + (relationship.diamondOffsetY || 0) * scale;

            connectionStart = { x: baseX, y: baseY };
        } else {
            connectionStart = {
                x: attribute.connectedTo.x * scale + offsetX + 60,
                y: attribute.connectedTo.y * scale + offsetY + 20
            };
        }
    }

    $: attributePosition = {
        x: connectionStart.x + attribute.x * scale,
        y: connectionStart.y + attribute.y * scale
    };

    const attributeWidth = 90;
    const attributeHeight = 40;

    $: attributeCenter = {
        x: attributePosition.x + (attributeWidth / 2) * scale,
        y: attributePosition.y + (attributeHeight / 2) * scale
    };

    $: connectionPath = `M ${connectionStart.x} ${connectionStart.y} L ${attributeCenter.x} ${attributeCenter.y}`;
</script>

<svelte:window
    on:mousemove={handleMouseMove}
    on:mouseup={handleMouseUp}
/>

<svg 
    class="connection-line" 
    width={window.innerWidth} 
    height={window.innerHeight} 
    style="position: fixed; top: 0; left: 0; pointer-events: none;"
>
    <path 
        d={connectionPath} 
        stroke="var(--text-color)" 
        stroke-width="2" 
        fill="none"
        vector-effect="non-scaling-stroke"
    />
</svg>

<div class="attribute"
    class:primary={attribute.isPrimary}
    class:multivalue={attribute.isMultivalue}
    class:calculated={attribute.isCalculated}
    style="top: {attributePosition.y}px; 
           left: {attributePosition.x}px; 
           transform: scale({scale}); 
           transform-origin: top left;"
    on:mousedown={handleMouseDown}
>
    <div class="name">{attribute.name}</div>
</div>

<style>
    
    .attribute {
        position: absolute;
        z-index: 2;
        width: 90px;
        height: 40px;
        background: var(--background-color);
        border: 2px solid var(--text-color);
        border-radius: 60px;
        cursor: move;
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .connection-line {
        position: absolute;
        width: 100%;
        height: 100%;
        pointer-events: none; 
        z-index: 0; 
    }

    .primary {
        border-width: 2px;
        border-color: #333;
        font-weight: bold;
    }

    .multivalue {
        border-style: double;
    }

    .calculated {
        border-style: dashed;
    }

    .name {
        font-family: monospace;
        font-size: 12px;
        color: var(--text-color);
    }
</style>