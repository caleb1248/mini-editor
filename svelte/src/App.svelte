<script lang="ts">
  import './lib/monaco-workers';
  import Editor from './lib/Editor.svelte';
</script>

<main><Editor let:editor /></main>

<style>
  main {
    width: 100%;
    height: 100%;
  }
</style>
