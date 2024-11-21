<script lang="ts">
    import { onMount } from "svelte";
    import Toolbar from "./Toolbar.svelte";

    let canvas: HTMLCanvasElement;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    const cellSize = 30;
    const minScale = 0.5;
    const maxScale = 5;


    function draw(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);
        
        
        drawGrid(ctx);
        drawCenter(ctx);
        ctx.restore();
    }

    function handleMouseDown(event: MouseEvent) {
        isDragging = true;
        lastX = event.clientX;
        lastY = event.clientY;
        canvas.style.cursor = 'grabbing';
    }

    function handleMouseMove(event: MouseEvent) {
        if(!isDragging) return;

        const deltaX = event.clientX - lastX;
        const deltaY = event.clientY - lastY;
        
        offsetX += deltaX;
        offsetY += deltaY;

        const maxOffsetX = width / 3;
        const minOffsetX = -width / 3;
        const maxOffsetY = height / 3;
        const minOffsetY = -height / 3;

        offsetX = Math.max(minOffsetX, Math.min(maxOffsetX, offsetX));
        offsetY = Math.max(minOffsetY, Math.min(maxOffsetY, offsetY));
        
        lastX = event.clientX;
        lastY = event.clientY;

        const ctx = canvas.getContext('2d');
        if (ctx) draw(ctx);
    }

    function handleMouseUp() {
        isDragging = false;
        canvas.style.cursor = 'default';
    }


    function handleWheel(event: WheelEvent) {
        event.preventDefault();
        const delta = event.deltaY;
        const scaleChange = delta > 0 ? 0.9 : 1.1;

        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const newScale = scale * scaleChange;
    
        if(newScale < minScale || newScale > maxScale) return;

        offsetX = mouseX - (mouseX - offsetX) * scaleChange;
        offsetY = mouseY - (mouseY - offsetY) * scaleChange;
        
        
        scale = newScale;

        const ctx = canvas.getContext('2d');
        if (ctx) draw(ctx);
    }

    function drawGrid(ctx: CanvasRenderingContext2D) {
        const gridSize = cellSize;
        const startX = Math.floor(-offsetX / scale / gridSize) * gridSize;
        const startY = Math.floor(-offsetY / scale / gridSize) * gridSize;
        const endX = startX + width / scale + gridSize;
        const endY = startY + height / scale + gridSize;

        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0,0,0,0.4)';
        ctx.lineWidth = 1 / scale;

        for(let x = startX; x <= endX; x += gridSize) {
            ctx.moveTo(x, startY);
            ctx.lineTo(x, endY);
        }

        for(let y = startY; y <= endY; y += gridSize) {
            ctx.moveTo(startX, y);
            ctx.lineTo(endX, y);
        }

        ctx.stroke();
    }

    function resetView() {
        scale = 1;
        offsetX = 0;
        offsetY = 0;
        const ctx = canvas.getContext('2d');
        if(ctx) draw(ctx);
    }

    function drawCenter(ctx: CanvasRenderingContext2D) {
        const dotSize = 4;
        ctx.beginPath();
        ctx.fillStyle = "rgba(255,0,0,0.3)";
        ctx.arc(width/2+10,height/2+2,dotSize/scale,0,Math.PI*2);
        ctx.fill();
    }

    onMount(() => {
        const ctx = canvas.getContext('2d');
        if(!ctx) return;
        draw(ctx);
    });

</script>

<svelte:window
    bind:innerWidth={width}
    bind:innerHeight={height}
    on:mouseup={handleMouseUp}
    on:mousemove={handleMouseMove}
/>

<Toolbar on:reset={resetView}/>

<canvas
    bind:this={canvas}
    width={width}
    height={height}
    on:wheel={handleWheel}
    on:mousedown={handleMouseDown}
/>


<style>
    canvas {
        display: block;
        background: white;
        touch-action: none;
    }
</style>