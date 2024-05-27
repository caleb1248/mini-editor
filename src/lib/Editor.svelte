<script lang="ts">
  import * as monaco from 'monaco-editor';
  import { onDestroy } from 'svelte';
  import addTextmate from './textmate/textmate';

  const editorDiv = document.createElement('div');
  editorDiv.classList.add('editor');

  const editor = monaco.editor.create(editorDiv, {
    value: 'console.log("Hello, World!")',
    language: 'javascript',
    automaticLayout: true,
    theme: 'vs-dark',
  });

  addTextmate();

  function initEditor(div: HTMLDivElement) {
    div.appendChild(editorDiv);
  }

  onDestroy(() => {
    monaco.editor.getModels().forEach((model) => model.dispose());
    editor.dispose();
  });
</script>

<slot {editor} />
<div class="editor-container" use:initEditor></div>

<style>
  div.editor-container,
  :global(div.editor) {
    width: 100%;
    height: 100%;
  }
</style>
