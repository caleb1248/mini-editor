<script lang="ts">
  import * as monaco from "monaco-editor";
  import { onDestroy } from "svelte";
  import { TokensProviderCache, convertTheme } from "./textmate/textmate";
  import themeJson from "./textmate/themes/my-theme.json";

  const editorDiv = document.createElement("div");
  editorDiv.classList.add("editor");
  console.log(monaco);
  monaco.editor.defineTheme("my-theme", convertTheme(themeJson));

  const editor = monaco.editor.create(editorDiv, {
    value: 'console.log("Hello, World!")',
    language: "typescript",
    automaticLayout: true,
    theme: "vs-dark",
  });
  import("./prettier");

  const cache = new TokensProviderCache(editor);
  cache.getTokensProvider("source.ts").then((provider) => {
    monaco.languages.setTokensProvider("typescript", provider);
    monaco.editor.setTheme("my-theme");
  });

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
