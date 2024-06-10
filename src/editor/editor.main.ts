import './workers';

import * as monaco from 'monaco-editor';

import { TokensProviderCache } from './textmate/index';
import convertTheme, { darkPlusTheme } from './textmate/theme-converter';

const editorDiv = document.createElement('div');
editorDiv.classList.add('editor');
document.getElementById('app')?.appendChild(editorDiv);
const model = monaco.editor.createModel(
  "console.log('hello world!')",
  'typescript',
  monaco.Uri.file('main.ts')
);

// Register textmate theme
const theme = convertTheme(darkPlusTheme);

monaco.editor.defineTheme('dark-plus', theme);

const editor = monaco.editor.create(editorDiv, {
  model,
  tabSize: 2,
  theme: 'dark-plus',
});

// Begin textmate stuff

const cache = new TokensProviderCache(editor);

monaco.languages.setTokensProvider(
  'typescript',
  await cache.getTokensProvider('source.ts')
);

monaco.languages.setLanguageConfiguration('typescript', conf);

window.addEventListener('resize', () => editor.layout());

// @ts-ignore
window.editor = editor;
