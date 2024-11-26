<script lang="ts">
    import type { Entity as EntityType } from '../Types/Entity';
    
    export let selectedEntity: EntityType | null;
    export let isOpen: boolean;
</script>

<div class="sidebar" class:open={isOpen}>
    <div class="content">
        {#if selectedEntity}
            <h2>{selectedEntity.name}</h2>
            <div class="properties">
                <label>
                    Name:
                    <input type="text" bind:value={selectedEntity.name}>
                </label>
                <label>
                    Weak Entity:
                    <input type="checkbox" bind:checked={selectedEntity.isWeak}>
                </label>
            </div>
            <h3>Attributes ({selectedEntity.attributes.length})</h3>
            <ul>
                {#each selectedEntity.attributes as attr}
                    <li>{attr.name}</li>
                {/each}
            </ul>
        {:else}
            <p>No entity selected</p>
        {/if}
    </div>
</div>

<style>
    .sidebar {
        position: fixed;
        top: 55px;
        right: -300px;
        width: 300px;
        height: calc(100vh - 60px);
        background: var(--background-color);
        box-shadow: -2px 0 5px rgba(0,0,0,0.1);
        transition: right 0.3s ease;
        z-index: 1000;
    }

    .sidebar.open {
        right: 0;
    }

    .content {
        padding: 20px;
    }

    h2 {
        margin: 0 0 20px 0;
    }

    h2, h3, p, label, input {
        color: var(--text-color);
    }

    .properties {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    label {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>