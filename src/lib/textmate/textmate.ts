import * as tm from 'monaco-textmate';
import wasmURL from 'onigasm/lib/onigasm.wasm?url';
import tsGrammar from './grammars/TypeScript.tmLanguage.json';

import * as monaco from 'monaco-editor';
import { loadWASM } from 'onigasm';

await loadWASM(await fetch(wasmURL).then((res) => res.arrayBuffer()));

const registry = new tm.Registry({
  getGrammarDefinition: async (scopeName) => {
    if (scopeName === 'source.ts') {
      return {
        format: 'json',
        content: tsGrammar,
      };
    } else throw new Error(`No grammar registered for scope: ${scopeName}`);
  },
});

export default async function addTextmate() {
  const grammar = await registry.loadGrammar('source.ts');

  if (!grammar) {
    throw new Error('Failed to load TypeScript grammar');
  }

  console.log('Loaded TypeScript grammar');
  monaco.languages.register({ id: 'typescript' });
  monaco.languages.setTokensProvider('typescript', {
    getInitialState: () => tm.INITIAL,
    tokenizeEncoded(line, state) {
      const result = grammar.tokenizeLine2(line, state as tm.StackElement);
      return {
        tokens: result?.tokens,
        endState: result?.ruleStack,
      };
    },
  });
}
