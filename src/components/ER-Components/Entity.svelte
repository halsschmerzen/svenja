<script lang="ts">
    import type { Entity as EntityType } from "../../Types/Entity";
    import { createEventDispatcher } from 'svelte';
    
    export let isSelected = false;
    export let entity: EntityType;
    export let scale = 1;
    export let offsetX = 0;
    export let offsetY = 0;
    
    let isDragging = false;
    let startX: number;
    let startY: number;

    const dispatch = createEventDispatcher();

    function handleMouseDown(event: MouseEvent) {
        isDragging = true;
        startX = event.clientX - (entity.x * scale + offsetX);
        startY = event.clientY - (entity.y * scale + offsetY);
    }

    function handleMouseMove(event: MouseEvent) {
        if(!isDragging) return;
        entity.x = (event.clientX - startX - offsetX) / scale;
        entity.y = (event.clientY - startY - offsetY) / scale;
        
        dispatch('update', { entity });
    }

    function handleMouseUp() {
        isDragging = false;
    }

    function handleClick(event: MouseEvent) {
        event.stopPropagation();
        if (!isSelected) {
            dispatch('select', { entity });
        } else {
            dispatch('deselect');
        }
    }
</script>

<svelte:window
    on:mousemove={handleMouseMove}
    on:mouseup={handleMouseUp}
/>

<div class="entity"
    class:weak={entity.isWeak}
    class:selected={isSelected}
    style="top: {entity.y * scale + offsetY}px; left: {entity.x * scale + offsetX}px; transform: scale({scale}); transform-origin: top left;"
    on:mousedown={handleMouseDown}
    on:click={handleClick}
>
    <div class="name">{entity.name}</div>
</div>

<style>
    .entity {
        position: absolute;
        width: 120px;
        height: 40px;
        background: var(--background-color);
        border: 2px solid var(--text-color);
        border-radius: 4px;
        cursor: move;
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        z-index: 1;
    }

    .weak {
        border: 6px double var(--text-color);
    }

    .selected {
        outline: 1px solid green;
    }

    .name {
        font-family: monospace;
        font-size: 14px;
        color: var(--text-color);
    }
</style>