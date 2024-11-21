<script lang="ts">
    import type { Attribute as AttributeType} from "../../Types/Attribute";

    export let attribute: AttributeType;
    export let scale = 1;
    export let offsetX = 0;
    export let offsetY = 0;

    let isDragging = false;
    let startX: number;
    let startY: number;

    function handleMouseDown(event: MouseEvent) {
        isDragging = true;
        startX = event.clientX - ((attribute.connectedTo.x + attribute.x) * scale + offsetX);
        startY = event.clientY - ((attribute.connectedTo.y + attribute.y) * scale + offsetY);
    }

    function handleMouseMove(event: MouseEvent) {
        if (!isDragging) return;
        const newX = (event.clientX - startX - offsetX) / scale - attribute.connectedTo.x;
        const newY = (event.clientY - startY - offsetY) / scale - attribute.connectedTo.y;
        attribute.x = newX;   
        attribute.y = newY;
    }

    function handleMouseUp() {
        isDragging = false;
    }

    $: entityCenterX = attribute.connectedTo.x * scale + offsetX + 60; 
    $: entityCenterY = attribute.connectedTo.y * scale + offsetY; 
    
    $: attributeLeftX = (attribute.connectedTo.x + attribute.x) * scale + offsetX+70;
    $: attributeCenterY = (attribute.connectedTo.y + attribute.y) * scale + offsetY; 

    $: connectionPath = `M ${entityCenterX} ${entityCenterY} L ${attributeLeftX} ${attributeCenterY}`;

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
        stroke="#333" 
        stroke-width="2" 
        fill="none"
        vector-effect="non-scaling-stroke"
    />
</svg>

<div class="attribute"
    class:primary={attribute.isPrimary}
    class:multivalue={attribute.isMultivalue}
    class:calculated={attribute.isCalculated}
    style="top: {(attribute.connectedTo.y + attribute.y) * scale + offsetY}px; left: {(attribute.connectedTo.x + attribute.x) * scale + offsetX}px; transform: scale({scale}); transform-origin: top left;"
    on:mousedown={handleMouseDown}
>
    <div class="name">{attribute.name}</div>
</div>

<style>
    
    .attribute {
        position: absolute;
        z-index: 1;;
        width: 90px;
        height: 40px;
        background: white;
        border: 2px solid #666;
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
        color: #333;
    }
</style>