<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    function handleReset() {
        dispatch('reset');
    }

</script>

<div class="toolbar">
    <p>svenja</p>
    <button>Hallo Welt!</button>
    <button on:click={handleReset}>Reset</button>
</div>

<style>
    * {
        font-size: 12px;
        font-family: monospace;
    }
    .toolbar {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        color:aliceblue;
        background-color: red;
        padding: 0.5rem;
        box-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, 0.125);
        z-index: 1000;
        display: flex;
        gap: 0.5rem;

    }
</style>