<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Entity as EntityType } from '../Types/Entity';
    import type { Relationship as RelationshipType } from '../Types/Relationship';
    
    export let selectedEntity: EntityType | null;
    export let selectedRelationship: RelationshipType | null;
    export let selectedAttribute: AttributeType | null;
    export let isOpen: boolean;

    const dispatch = createEventDispatcher();

    $: if (selectedEntity) {
        dispatch('entityUpdate', { entity: selectedEntity });
    }
    $: if (selectedRelationship) {
        dispatch('relationshipUpdate', { relationship: selectedRelationship });
    }
    $: if (selectedAttribute) {
        dispatch('attributeUpdate', { attribute: selectedAttribute });
    }
</script>

<div class="sidebar" class:open={isOpen}>
    <div class="content">
        {#if selectedEntity}
            <h2>{selectedEntity.name}</h2>
            <div class="properties">
                <label>
                    Name:
                    <input 
                        type="text" 
                        bind:value={selectedEntity.name}
                        on:input={() => dispatch('entityUpdate', { entity: selectedEntity })}
                    >
                </label>
                <label>
                    Weak Entity:
                    <input 
                        type="checkbox" 
                        bind:checked={selectedEntity.isWeak}
                        on:change={() => dispatch('entityUpdate', { entity: selectedEntity })}
                    >
                </label>
            </div>
            <h3>Attributes ({selectedEntity.attributes.length})</h3>
            <ul>
                {#each selectedEntity.attributes as attr}
                    <li>{attr.name}</li>
                {/each}
            </ul>
        {:else if selectedRelationship}
            <h2>Relationship</h2>
            <div class="properties">
                <label>
                    Name:
                    <input 
                        type="text" 
                        bind:value={selectedRelationship.name}
                        on:input={() => dispatch('relationshipUpdate', { relationship: selectedRelationship })}
                    >
                </label>
                <label>
                    Type:
                    <select 
                        bind:value={selectedRelationship.relationship_type}
                        on:change={() => dispatch('relationshipUpdate', { relationship: selectedRelationship })}
                    >
                        <option value="1-1">One to One</option>
                        <option value="1-N">One to Many</option>
                        <option value="N-1">Many to One</option>
                        <option value="N-N">Many to Many</option>
                    </select>
                </label>
                <label>
                    From Entity:
                    <select bind:value={selectedRelationship.from_entity}>
                        <option value="can">Can</option>
                        <option value="must">Must</option>
                    </select>
                </label>
                <label>
                    To Entity:
                    <select bind:value={selectedRelationship.to_entity}>
                        <option value="can">Can</option>
                        <option value="must">Must</option>
                    </select>
                </label>
                <h3>Attributes ({selectedRelationship.attributes.length})</h3>
                <ul>
                    {#each selectedRelationship.attributes as attr}
                        <li>{attr.name}</li>
                    {/each}
                </ul>
            </div>
        {:else if selectedAttribute}
            <h2>Attribute</h2>
            <div class="properties">
                <label>
                    Name:
                    <input 
                        type="text" 
                        bind:value={selectedAttribute.name}
                        on:input={() => dispatch('attributeUpdate', { attribute: selectedAttribute })}
                    >
                </label>
                <label>
                    Primary Key:
                    <input 
                        type="checkbox" 
                        bind:checked={selectedAttribute.isPrimary}
                        on:change={() => dispatch('attributeUpdate', { attribute: selectedAttribute })}
                    >
                </label>
                <label>
                    Multi-value:
                    <input 
                        type="checkbox" 
                        bind:checked={selectedAttribute.isMultivalue}
                        on:change={() => dispatch('attributeUpdate', { attribute: selectedAttribute })}
                    >
                </label>
                <label>
                    Calculated:
                    <input 
                        type="checkbox" 
                        bind:checked={selectedAttribute.isCalculated}
                        on:change={() => dispatch('attributeUpdate', { attribute: selectedAttribute })}
                    >
                </label>
            </div>
        {:else}
            <p>No item selected</p>
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