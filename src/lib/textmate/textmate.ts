import tm, { type IOnigLib } from 'vscode-textmate';
import oniguruma from 'vscode-oniguruma';
import wasmURL from 'vscode-oniguruma/release/onig.wasm?url';
import * as monaco from 'monaco-editor';
const onigWasm = await fetch(wasmURL).then((response) =>
  response.arrayBuffer()
);

const onigLib = oniguruma.loadWASM({ data: onigWasm }).then(() => {
  return {
    createOnigScanner(patterns) {
      return new oniguruma.OnigScanner(patterns);
    },
    createOnigString(s) {
      return new oniguruma.OnigString(s);
    },
  } as IOnigLib;
});

const registry = new tm.Registry({
  onigLib,
  loadGrammar: async (scopeName) => {
    if (scopeName === 'source.js') {
    }
    return null;
  },
});

monaco.editor.defineTheme('myCoolTheme', {
  base: 'vs-dark',
  inherit: true,
  rules: [{ token: 'comment', foreground: 'ffa500', fontStyle: 'italic' }],
  colors: {},
});
