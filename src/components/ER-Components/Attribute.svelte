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
        startX = event.clientX - (attribute.x * scale + offsetX);
        startY = event.clientY - (attribute.y * scale + offsetY);
    }

    function handleMouseMove(event: MouseEvent) {
        if(!isDragging) return;
        attribute.x = (event.clientX-startX-offsetX) /scale;
        attribute.y = (event.clientY-startY-offsetY) /scale;
    }

    function handleMouseUp() {
        isDragging = false;
    }

    $: connectionPath = `M ${attribute.x * scale + offsetX + 45} ${attribute.y * scale + offsetY + 30} L ${attribute.connectedTo.x * scale + offsetX + 60} ${attribute.connectedTo.y * scale + offsetY + 30}`;

</script>

<svelte:window
    on:mousemove={handleMouseMove}
    on:mouseup={handleMouseUp}
/>

<svg style="position: absolute; width: 100%; height: 100%; pointer-events: none;">
    <path d={connectionPath} stroke="#333" stroke-width="1" fill="none"/>
</svg>

<div class="attribute"
    class:primary={attribute.isPrimary}
    class:multivalue={attribute.isMultivalue}
    class:calculated={attribute.isCalculated}
    style="top: {attribute.y * scale + offsetY}px; left: {attribute.x * scale + offsetX}px; transform: scale({scale}); transform-origin: top left;"
    on:mousedown={handleMouseDown}
>
    <div class="name">{attribute.name}</div>
</div>

<style>
    .attribute {
        position: absolute;
        width: 90px;
        height: 40px;
        background: white;
        border: 1px solid #666;
        border-radius: 50px;
        cursor: move;
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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