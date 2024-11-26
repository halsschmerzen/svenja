<script lang="ts">
  import Canvas from "./components/Canvas.svelte";
  import { theme } from './stores/theme';
  import './App.css'
</script>

<main class={$theme}>
  <Canvas/>
</main>

<style>
  :global(.light) {
    --background-color: #ffffff;
    --text-color: #333333;
    --primary-color: #6200ee;
    --toolbar-background: red;
  }

  :global(.dark) {
    --background-color: #121212;
    --text-color: #cccccc;
    --primary-color: #bb86fc;
    --toolbar-background: #333333;
    
  }

  main {
    background-color: var(--background-color);
    color: var(--text-color);
  }
</style>
