<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { Entity } from "../Types/Entity";
    export let selectedEntity: Entity | null = null;

    const dispatch = createEventDispatcher();

    function handleReset() {
        dispatch('reset');
    }

    function handleAddEntity() {
        dispatch('addEntity');
    }
    function handleGridToggle() {
        dispatch('toggleGrid');
    }

    function handleAddAttribute() {
        dispatch('addAttribute')
    }

    function handleToggleTheme() {
        dispatch('toggleTheme')
    }

    function handleAddRelationship() {
        dispatch('addRelationship');
    }

</script>

<div class="toolbar">
    <p>svenja</p>
    <button>Hallo Welt!</button>
    <button on:click={handleReset}>Reset</button>
    <button on:click={handleAddEntity}>Entity</button>
    <button on:click={handleGridToggle}>Toggle Grid</button>
    <button on:click={handleToggleTheme}>Toggle Theme</button>
    <button on:click={handleAddRelationship}>Add Relationship</button>
    {#if selectedEntity}
        <button on:click={handleAddAttribute}>Add Attribute</button>
    {/if}
</div>

<style>
    * {
        font-size: 12px;
        
    }
    .toolbar {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        color: var(--text-color);
        background-color: var(--toolbar-background);
        padding: 0.5rem;
        box-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, 0.125);
        z-index: 1000;
        display: flex;
        gap: 0.5rem;

    }
</style>