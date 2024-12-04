<script lang="ts">
    import type { Attribute as AttributeType} from "../../Types/Attribute";
    import { createEventDispatcher } from 'svelte';

    export let attribute: AttributeType;
    export let scale = 1;
    export let offsetX = 0;
    export let offsetY = 0;
    export let isSelected = false;

    const dispatch = createEventDispatcher();
    const attributeWidth = 90;
    const attributeHeight = 40;

    type Point = { x: number; y: number };
    let connectionStart: Point = { x: 0, y: 0 };
    let isDragging = false;
    let startX: number;
    let startY: number;
    let attributeStartX = 0;
    let attributeStartY = 0;

    $: hasSubattributes = attribute.subattributes && attribute.subattributes.length > 0;

    function getAttributePosition(attr: AttributeType) {
        if ('entities' in attr.connectedTo) {
            const relationship = attr.connectedTo;
            const entity1CenterX = (relationship.entities[0].x + 60) * scale + offsetX;
            const entity1CenterY = (relationship.entities[0].y + 20) * scale + offsetY;
            const entity2CenterX = (relationship.entities[1].x + 60) * scale + offsetX;
            const entity2CenterY = (relationship.entities[1].y + 20) * scale + offsetY;
            const baseX = (entity1CenterX + entity2CenterX) / 2 + (relationship.diamondOffsetX || 0) * scale;
            const baseY = (entity1CenterY + entity2CenterY) / 2 + (relationship.diamondOffsetY || 0) * scale;
            return {
                x: baseX + attr.x * scale,
                y: baseY + attr.y * scale
            };
        } else if ('attributes' in attr.connectedTo) {
            return {
                x: (attr.connectedTo.x + attr.x) * scale + offsetX,
                y: (attr.connectedTo.y + attr.y) * scale + offsetY
            };
        } else {
            const parentPos = getAttributePosition(attr.connectedTo);
            return {
                x: parentPos.x + attr.x * scale,
                y: parentPos.y + attr.y * scale
            };
        }
    }

    function handleMouseDown(event: MouseEvent) {
        isDragging = true;
        if ('entities' in attribute.connectedTo) {
            startX = event.clientX;
            startY = event.clientY;
            attributeStartX = attribute.x;
            attributeStartY = attribute.y;
        } else if ('attributes' in attribute.connectedTo) {
            startX = event.clientX - ((attribute.connectedTo.x + attribute.x) * scale + offsetX);
            startY = event.clientY - ((attribute.connectedTo.y + attribute.y) * scale + offsetY);
        } else {
            startX = event.clientX;
            startY = event.clientY;
            attributeStartX = attribute.x;
            attributeStartY = attribute.y;
        }
    }

    function handleMouseMove(event: MouseEvent) {
        if (!isDragging) return;
        if ('entities' in attribute.connectedTo) {
            const deltaX = (event.clientX - startX) / scale;
            const deltaY = (event.clientY - startY) / scale;
            attribute.x = attributeStartX + deltaX;
            attribute.y = attributeStartY + deltaY;
        } else if ('attributes' in attribute.connectedTo) {
            attribute.x = (event.clientX - startX - offsetX) / scale - attribute.connectedTo.x;
            attribute.y = (event.clientY - startY - offsetY) / scale - attribute.connectedTo.y;
        } else {
            const deltaX = (event.clientX - startX) / scale;
            const deltaY = (event.clientY - startY) / scale;
            attribute.x = attributeStartX + deltaX;
            attribute.y = attributeStartY + deltaY;
        }
        dispatch('update', { attribute });
    }

    function handleMouseUp() {
        isDragging = false;
    }

    function handleClick(event: MouseEvent) {
        event.stopPropagation();
        if (!isSelected) {
            dispatch('select', { attribute });
        } else {
            dispatch('deselect');
        }
    }

    function getParallelLines(x1: number, y1: number, x2: number, y2: number, gap = 3) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.sqrt(dx * dx + dy * dy);
        const perpX = -dy / length * gap;
        const perpY = dx / length * gap;
        const line1Start = `${x1 + perpX},${y1 + perpY}`;
        const line1End = `${x2 + perpX},${y2 + perpY}`;
        const line2Start = `${x1 - perpX},${y1 - perpY}`;
        const line2End = `${x2 - perpX},${y2 - perpY}`;
        return {
            line1: `M ${line1Start} L ${line1End}`,
            line2: `M ${line2Start} L ${line2End}`
        };
    }

    $: {
        if ('entities' in attribute.connectedTo) {
            const relationship = attribute.connectedTo;
            const entity1CenterX = (relationship.entities[0].x + 60) * scale + offsetX;
            const entity1CenterY = (relationship.entities[0].y + 20) * scale + offsetY;
            const entity2CenterX = (relationship.entities[1].x + 60) * scale + offsetX;
            const entity2CenterY = (relationship.entities[1].y + 20) * scale + offsetY;
            const baseX = (entity1CenterX + entity2CenterX) / 2 + (relationship.diamondOffsetX || 0) * scale;
            const baseY = (entity1CenterY + entity2CenterY) / 2 + (relationship.diamondOffsetY || 0) * scale;
            connectionStart = { x: baseX, y: baseY };
        } else if ('attributes' in attribute.connectedTo) {
            connectionStart = {
                x: attribute.connectedTo.x * scale + offsetX + 60,
                y: attribute.connectedTo.y * scale + offsetY + 20
            };
        } else {
            const parentPos = getAttributePosition(attribute.connectedTo);
            connectionStart = {
                x: parentPos.x + (attributeWidth / 2) * scale,
                y: parentPos.y + (attributeHeight / 2) * scale
            };
        }
    }

    $: attributePosition = getAttributePosition(attribute);
    
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
    {#if attribute.isMultivalue}
        {@const lines = getParallelLines(connectionStart.x, connectionStart.y, attributeCenter.x, attributeCenter.y)}
        <path d={lines.line1} stroke="var(--text-color)" stroke-width="2" fill="none" vector-effect="non-scaling-stroke"/>
        <path d={lines.line2} stroke="var(--text-color)" stroke-width="2" fill="none" vector-effect="non-scaling-stroke"/>
    {:else}
        <path d={connectionPath} stroke="var(--text-color)" stroke-width="2" stroke-dasharray={attribute.isCalculated ? "5,5" : "none"} fill="none" vector-effect="non-scaling-stroke"/>
    {/if}
</svg>

<div class="attribute"
    class:primary={attribute.isPrimary}
    class:multivalue={attribute.isMultivalue}
    class:calculated={attribute.isCalculated}
    class:selected={isSelected}
    style="top: {attributePosition.y}px; left: {attributePosition.x}px; transform: scale({scale}); transform-origin: top left;"
    on:mousedown={handleMouseDown}
    on:click={handleClick}
>
    <div class="name" class:primary-text={attribute.isPrimary}>{attribute.name}</div>
</div>

{#if hasSubattributes}
    {#each attribute.subattributes as subattribute (subattribute.id)}
        <svelte:self
            attribute={subattribute}
            {scale}
            {offsetX}
            {offsetY}
            isSelected={isSelected === subattribute}
            on:select
            on:deselect
            on:update
        />
    {/each}
{/if}

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
    .selected {
        outline: 2px solid green;
    }

    .name {
        font-family: monospace;
        font-size: 12px;
        color: var(--text-color);
    }

    .primary-text {
        text-decoration: underline;
    }
</style>