<script lang="ts">
    import type { Entity as EntityType } from "../../Types/Entity";

    export let entity: EntityType;
    export let scale = 1;
    
    let isDragging = false;
    let startX: number;
    let startY: number;

    function handleMouseDown(event: MouseEvent) {
        isDragging = true;
        startX = event.clientX - entity.x;
        startY = event.clientY - entity.y;
    }

    function handleMouseMove(event: MouseEvent) {
        if(!isDragging) return;
        entity.x = event.clientX - startX;
        entity.y = event.clientY - startY;
    }

    function handleMouseUp() {
        isDragging = false;
    }
</script>

<div class="entity"
    class:weak={entity.isWeak}
    style="top: {entity.y}px; left: {entity.x}px; transform: scale({scale}); transform-origin: top left;"
    on:mousedown={handleMouseDown}
    on:mousemove={handleMouseMove}
    on:mouseup={handleMouseUp}
>
    <div class="name">{entity.name}</div>
</div>

<style>
    .entity {
        position: absolute;
        width: 120px;
        height: 60px;
        background: white;
        border: 2px solid #333;
        border-radius: 4px;
        cursor: move;
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .weak {
        border-style: dashed;
    }

    .name {
        font-family: monospace;
        font-size: 14px;
        color: #333;
    }
</style>