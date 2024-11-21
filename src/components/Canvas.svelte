<script lang="ts">
    import { onMount } from "svelte";

    let canvas: HTMLCanvasElement;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    const cellSize = 50;


    function draw(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);
        

        drawGrid(ctx);
        
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
        ctx.strokeStyle = '#ddd';
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