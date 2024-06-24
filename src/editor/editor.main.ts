import * as monaco from 'monaco-editor';

import { emmetHTML, emmetCSS, emmetJSX } from 'emmet-monaco-es';
// @ts-ignore no typings are available
import { IDialogService } from 'monaco-editor/esm/vs/platform/dialogs/common/dialogs';

import { TokensProviderCache } from './textmate/index';
import { formatCSS, formatHTML } from './prettier/prettier';
import defaultColors from './default-colors';
// Emmet setup
emmetHTML(monaco);
emmetCSS(monaco);
emmetJSX(monaco);

// Editor setup
const editorDiv = document.createElement('div');
editorDiv.classList.add('editor');
document.getElementById('editor-part')?.appendChild(editorDiv);

const editor = monaco.editor.create(
  editorDiv,
  {
    tabSize: 2,
    fontFamily: '"JetBrains Mono", Consolas, "Courier New", monospace',
    fontLigatures: true,
    theme: 'vs-dark',
  },
  {
    [IDialogService.toString()]: {
      error: console.error,
    },
  }
) as monaco.editor.IStandaloneCodeEditor & { _themeService: any };

editor.focus();

// Begin textmate stuff

const cache = new TokensProviderCache(editor);

monaco.languages.setTokensProvider(
  'typescript',
  await cache.getTokensProvider('source.ts')
);

monaco.languages.setTokensProvider(
  'html',
  await cache.getTokensProvider('text.html.basic')
);

monaco.languages.setTokensProvider(
  'css',
  await cache.getTokensProvider('source.css')
);

// End textmate stuff

// Initialize the models
const html = monaco.editor.createModel(
  '<h1>Hello world!</h1>',
  'html',
  monaco.Uri.file('index.html')
);

const css = monaco.editor.createModel(
  `h1 {
  color: red;
}`,
  'css',
  monaco.Uri.file('style.css')
);

const ts = monaco.editor.createModel(
  "console.log('hello world!')",
  'typescript',
  monaco.Uri.file('main.ts')
);

function setModelBasedOnTab(tab: 0 | 1 | 2) {
  switch (tab) {
    case 0:
      editor.setModel(html);
      break;
    case 1:
      editor.setModel(css);
      break;
    case 2:
      editor.setModel(ts);
      break;
  }
}

setModelBasedOnTab(0);

window.addEventListener('resize', () => setTimeout(() => editor.layout(), 100));

monaco.languages.html.htmlDefaults.setModeConfiguration({
  ...monaco.languages.html.htmlDefaults.modeConfiguration,
  documentFormattingEdits: false,
  documentRangeFormattingEdits: false,
});

monaco.languages.css.cssDefaults.setModeConfiguration({
  ...monaco.languages.css.cssDefaults.modeConfiguration,
  documentFormattingEdits: false,
  documentRangeFormattingEdits: false,
});

monaco.languages.registerDocumentFormattingEditProvider('html', {
  provideDocumentFormattingEdits: async (model) => {
    const text = model.getValue();
    const formatted = await formatHTML(text);
    return [
      {
        range: model.getFullModelRange(),
        text: formatted,
      },
    ];
  },
});

monaco.languages.registerDocumentFormattingEditProvider('css', {
  provideDocumentFormattingEdits: async (model) => {
    const text = model.getValue();
    const formatted = await formatCSS(text);
    return [
      {
        range: model.getFullModelRange(),
        text: formatted,
      },
    ];
  },
});

// @ts-ignore
window.editor = editor; // Used for debuggin in the inspect panel.

type ThemeChangedCallback = () => void;

const themeSubscriptions: ThemeChangedCallback[] = [];

function onThemeChanged(callback: ThemeChangedCallback): monaco.IDisposable {
  // Invoke the callback to send the current theme.
  callback();

  themeSubscriptions.push(callback);

  return {
    dispose() {
      const index = themeSubscriptions.indexOf(callback);
      if (index !== -1) {
        themeSubscriptions.splice(index, 1);
      }
    },
  };
}

const colorThemeStyleSheet = document.getElementById(
  'color-theme'
) as HTMLStyleElement;

editor._themeService.onDidColorThemeChange(
  ({ themeData }: { themeData: monaco.editor.IStandaloneThemeData }) => {
    const colors = {
      ...defaultColors[themeData.base === 'vs-dark' ? 'dark' : 'light'],
      ...themeData.colors,
    };

    let css = '';
    for (const key in colors) {
      const value = colors[key];
      if (value) css += `--${key.replace(/\./g, '-')}: ${value};`;
    }

    colorThemeStyleSheet.textContent = `div#app{${css}}`;

    themeSubscriptions.forEach((callback) => callback());
  }
);

function cssVar(color: string) {
  return `var(--${color.replace(/\./g, '-')})`;
}

// open the command palette when the user presses ctrl + shift + p
window.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() == 'p') {
    e.preventDefault();
    editor.trigger('keyboard', 'editor.action.quickCommand', null);
  }
});

export { setModelBasedOnTab, onThemeChanged, editor, cssVar };
