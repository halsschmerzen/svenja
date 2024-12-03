<script lang="ts">
    import { onMount } from "svelte";
    import Toolbar from "./Toolbar.svelte";
    import type {Entity as EntityType} from '../Types/Entity';
    import type { Attribute as AttributeType } from "../Types/Attribute";
    import { toggleTheme } from '../stores/theme';
    import Entity from "./ER-Components/Entity.svelte";
    import Attribute from "./ER-Components/Attribute.svelte";
    import Sidebar from "./Sidebar.svelte";
    import { theme } from '../stores/theme';
    import Relationship from "./ER-Components/Relationship.svelte";
    import type { Relationship as RelationshipType } from "../Types/Relationship";

    let canvas: HTMLCanvasElement;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;
    let gridEnabled = false;
    let isSidebarOpen = false;
    let lastX = 0;
    let lastY = 0;
    let selectedEntity: EntityType | null = null;
    let selectedRelationship: RelationshipType | null = null;
    const cellSize = 30;
    const minScale = 0.75;
    const maxScale = 5;
    let isRelationshipMode = false;
    let selectedEntities: EntityType[] = [];
    let relationships: RelationshipType[] = [];
    let relationshipModeIndicator = '';

    let entities: EntityType[] = [
        {
            id: 0,
            name: "Test Entity",
            x: 100,
            y: 100,
            isWeak: false,
            attributes: [],
            relationships: []
        }
    ];

    function draw(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);
        
        
        if(gridEnabled) {
            drawGrid(ctx);
        }
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

    function resetView() {
        scale = 1;
        offsetX = 0;
        offsetY = 0;
        updateOnce();
    }

    onMount(() => {
        const ctx = canvas.getContext('2d');
        if(!ctx) return;
        draw(ctx);
    });

    function addEntity() {
        const centerX = (width/2-offsetX)/scale;
        const centerY = (height/2-offsetY)/scale;

        const newEntity: EntityType = {
            id: entities.length+1,
            name: `Entity ${entities.length+1}`,
            x: centerX,
            y: centerY,
            isWeak: false,
            attributes: [],
            relationships: []
        };

        entities = [...entities, newEntity];
    }

    /*
    * Functions concerning the Grid
    */

    function drawCenter(ctx: CanvasRenderingContext2D) {
        const dotSize = 4;
        ctx.beginPath();
        ctx.fillStyle = "rgba(255,0,0,0.3)";
        ctx.arc(width/2+10,height/2+2,dotSize/scale,0,Math.PI*2);
        ctx.fill();
    }

    function toggleGrid() {
        gridEnabled = !gridEnabled;
        const ctx = canvas.getContext('2d');
        updateOnce();
        if(ctx) draw(ctx);
        console.log(entities)
    }

    function drawGrid(ctx: CanvasRenderingContext2D) {
        const gridSize = cellSize;
        const startX = Math.floor(-offsetX / scale / gridSize) * gridSize;
        const startY = Math.floor(-offsetY / scale / gridSize) * gridSize;
        const endX = startX + width / scale + gridSize;
        const endY = startY + height / scale + gridSize;

        ctx.beginPath();
        ctx.strokeStyle = $theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.3)';
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

    /**
     * 
     * Functions concerning Attributes
     * 
    */

    function handleAddAttribute() {

        if (selectedEntity) {
            const entity = entities.find(e => e.id === selectedEntity.id);
            if (entity) {
                const newAttribute: AttributeType = {
                    id: entity.attributes.length + 1,
                    name: `Attribute ${entity.attributes.length + 1}`,
                    x: 100,
                    y: 0,
                    connectedTo: entity,
                    isPrimary: false,
                    isCalculated: false,
                    isMultivalue: false
                };
                entity.attributes = [...entity.attributes, newAttribute];
            }
        }

        if (selectedRelationship) {
            const relationship = relationships.find(r => r.id === selectedRelationship.id);
            if (relationship) {
                const newAttribute: AttributeType = {
                    id: relationship.attributes.length + 1,
                    name: `Attribute ${relationship.attributes.length + 1}`,
                    x: 200,
                    y: 0,
                    connectedTo: relationship, 
                    isPrimary: false,
                    isCalculated: false,
                    isMultivalue: false
                };
                relationship.attributes = [...relationship.attributes, newAttribute];
                relationships = [...relationships];
            }
     }
    }

    function toggleSidebar() {
        isSidebarOpen = !isSidebarOpen;
    }

    function updateOnce() {
        const ctx = canvas.getContext('2d');
        if(ctx) draw(ctx);
    }
    
    function toggleCanvasTheme() {
        toggleTheme();
        updateOnce();
    }

    function handleAddRelationship() {
        isRelationshipMode = true;
        handleEntityDeselect();
        selectedEntities = [];
        relationshipModeIndicator = 'Relationship Mode: Select two entities.';
        canvas.style.cursor = 'crosshair';
    }

    function handleCanvasClick() {
        if (isRelationshipMode) {
            isRelationshipMode = false;
            selectedEntities = [];
            relationshipModeIndicator = '';
            canvas.style.cursor = 'default';
            console.log(relationships)
        }
        selectedEntity = null;
        handleRelationshipDeselect();
    }

    function handleEntitySelect(event: CustomEvent) {
        const entity = event.detail.entity;
        handleRelationshipDeselect();
        if (isRelationshipMode) {
            selectedEntities.push(entity);
            if (selectedEntities.length === 2) {
                const newRelationship: RelationshipType = {
                    id: relationships.length + 1,
                    name: "has",
                    entities: [selectedEntities[0], selectedEntities[1]],
                    relationship_type: '1-N',
                    from_entity: 'can', 
                    to_entity: 'can',
                    attributes: []
                };
                relationships = [...relationships, newRelationship];
                selectedEntities = [];
                isRelationshipMode = false;
                relationshipModeIndicator = '';
                canvas.style.cursor = 'default';
            }
        } else {
            selectedEntity = entity;
            isSidebarOpen = true;
        }
    }

    function handleEntityUpdate(event: CustomEvent) {
        const updatedEntity: EntityType = event.detail.entity;
        const index = entities.findIndex(e => e.id === updatedEntity.id);
        if (index !== -1) {
            entities[index].x = updatedEntity.x;
            entities[index].y = updatedEntity.y;
            entities = [...entities];
            relationships = [...relationships];
        }
    }

    function handleEntityDeselect() {
        selectedEntity = null;
    }

    function handleRelationshipTypeUpdate(event: CustomEvent<{ relationship: RelationshipType }>) {
        const updatedRelationship = event.detail.relationship;
        const index = relationships.findIndex(r => r.id === updatedRelationship.id);
        if (index !== -1) {
            relationships[index].relationship_type = updatedRelationship.relationship_type;
            relationships = [...relationships]; 
        }
    }

    function handleRelationshipSelect(event: CustomEvent) {
        selectedEntity = null;
        selectedRelationship = event.detail.relationship;
        isSidebarOpen = true;
    }

    function handleRelationshipDeselect() {
        selectedRelationship = null;
    }

</script>

<svelte:window
    bind:innerWidth={width}
    bind:innerHeight={height}
    on:mouseup={handleMouseUp}
    on:mousemove={handleMouseMove}
/>

<Toolbar 
    on:reset={resetView} 
    on:addEntity={addEntity} 
    on:toggleGrid={toggleGrid} 
    on:addAttribute={handleAddAttribute}
    on:toggleTheme={toggleCanvasTheme}
    on:addRelationship={handleAddRelationship}
    {selectedEntity}
    {selectedRelationship}
/>

{#if isRelationshipMode}
    <div class="relationship-mode-indicator">
        {relationshipModeIndicator}
    </div>
{/if}

{#each entities as entity (entity.id)}
    <Entity
        bind:entity
        {scale}
        {offsetX}
        {offsetY}
        isSelected={selectedEntity?.id === entity.id}
        on:select={handleEntitySelect}
        on:deselect={handleEntityDeselect}
        on:update={handleEntityUpdate}
    />
    {#each entity.attributes as attribute (attribute.id)}
        <Attribute
            {attribute}
            {scale}
            {offsetX}
            {offsetY}
        />
    {/each}

{/each}

{#each relationships as relationship (relationship.id)}
    <Relationship
        {relationship}
        {scale}
        {offsetX}
        {offsetY}
        isSelected={selectedRelationship?.id === relationship.id}
        on:updateType={handleRelationshipTypeUpdate}
        on:select={handleRelationshipSelect}
        on:deselect={handleRelationshipDeselect}
    />
    {#each relationship.attributes as attribute (attribute.id)}
        <Attribute
            {attribute}
            {scale}
            {offsetX}
            {offsetY}
        />
    {/each}
{/each}

<button 
    class="toggle-sidebar" 
    on:click={toggleSidebar}
>
    {isSidebarOpen ? '→' : '←'}
</button>

<Sidebar 
    bind:isOpen={isSidebarOpen}
    bind:selectedEntity
    bind:selectedRelationship
    on:entityUpdate={({detail}) => {
        const index = entities.findIndex(e => e.id === detail.entity.id);
        if (index !== -1) {
            entities[index] = detail.entity;
            entities = [...entities];
        }
    }}
    on:relationshipUpdate={({detail}) => {
        const index = relationships.findIndex(r => r.id === detail.relationship.id);
        if (index !== -1) {
            relationships[index] = detail.relationship;
            relationships = [...relationships];
        }
    }}
/>

<canvas
    bind:this={canvas}
    width={width}
    height={height}
    on:wheel={handleWheel}
    on:mousedown={handleMouseDown}
    on:click={handleCanvasClick}
/>

<style>
    canvas {
        display: block;
        background: white;
        touch-action: none;
        background-color: var(--background-color);
    }
    .toggle-sidebar {
        position: fixed;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1001;
        padding: 8px;
        background: white;
        border: 1px solid #ccc;
        border-right: none;
        border-radius: 4px 0 0 4px;
        cursor: pointer;
    }
    .relationship-mode-indicator {
        position: fixed;
        top: 60px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        z-index: 1001;
        font-size: 14px;
    }
</style>