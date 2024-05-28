import * as vsctm from 'vscode-textmate';
import * as oniguruma from 'vscode-oniguruma';
import wasmUrl from 'vscode-oniguruma/release/onig.wasm?url';
import tsLang from './grammars/TypeScript.tmLanguage?raw';
import myTheme from './themes/my-theme.json'
const vscodeOnigurumaLib = oniguruma
  .loadWASM({ data: await fetch(wasmUrl).then((r) => r.arrayBuffer()) })
  .then(() => {
    return {
      createOnigScanner(patterns) {
        return new oniguruma.OnigScanner(patterns);
      },
      createOnigString(s) {
        return new oniguruma.OnigString(s);
      },
    } as vsctm.IOnigLib;
  });

// Create a registry that can create a grammar from a scope name.
const registry = new vsctm.Registry({
  onigLib: vscodeOnigurumaLib,
  loadGrammar: async (scopeName) => {
    if (scopeName === 'source.js') {
      console.log('providing grammar for source.js')
      return vsctm.parseRawGrammar(tsLang);
    }
    throw `Unknown scope name: ${scopeName}`;
  },
});

// Load the JavaScript grammar and any other grammars included by it async.
registry.loadGrammar('source.js').then((grammar) => {
  const text = [`function sayHello(name) {`, `\treturn "Hello, " + name;`, `}`];
  let ruleStack = vsctm.INITIAL;
  for (let i = 0; i < text.length; i++) {
    const line = text[i];
    const lineTokens = grammar!.tokenizeLine(line, ruleStack);
    console.log(`\nTokenizing line: ${line}`);
    for (let j = 0; j < lineTokens.tokens.length; j++) {
      const token = lineTokens.tokens[j];
      console.log(
        ` - token from ${token.startIndex} to ${token.endIndex} ` +
        `(${line.substring(token.startIndex, token.endIndex)}) ` +
        `with scopes ${token.scopes.join(', ')}`
      );
    }
    ruleStack = lineTokens.ruleStack;
  }
});

export default function addTextmate(monaco: typeof import('monaco-editor')) {
  monaco.languages.register({ id: 'typescript' });
  registry.loadGrammar('source.js').then(grammar => {
    monaco.languages.setTokensProvider('typescript', {
      getInitialState: () => {
        return vsctm.INITIAL;
      },
      tokenize: (line, state) => {
        console.log('tokenizing line...')
        const lineTokens = grammar!.tokenizeLine(line, state as vsctm.StateStack);
        const monacoTokens = lineTokens.tokens.map((token) => ({
          startIndex: token.startIndex,
          scopes: token.scopes[0],
        }));
        return { tokens: monacoTokens, endState: lineTokens.ruleStack };
      },
    });
  }).catch(e => alert(e.message));
  monaco.editor.defineTheme('my-theme', myTheme);
  monaco.editor.setTheme('my-theme')
}
