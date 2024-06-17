import * as monaco from 'monaco-editor';

import { emmetHTML, emmetCSS, emmetJSX } from 'emmet-monaco-es';

import { TokensProviderCache } from './textmate/index';
import convertTheme, { darkPlusTheme } from './textmate/theme-converter';
import { formatCSS, formatHTML } from './prettier/prettier';
import { rgbaToCSSValue, type Color } from './monaco-colors';
import defaultColors from './default-colors';

// Emmet setup
emmetHTML(monaco);
emmetCSS(monaco);
emmetJSX(monaco);

// Editor setup
const editorDiv = document.createElement('div');
editorDiv.classList.add('editor');
document.getElementById('editor-part')?.appendChild(editorDiv);

// Register textmate theme
const theme = convertTheme(darkPlusTheme);

monaco.editor.defineTheme('dark-plus', theme);

const editor = monaco.editor.create(editorDiv, {
  tabSize: 2,
  fontFamily: '"JetBrains Mono", Consolas, "Courier New", monospace',
});

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

let tabBackground = defaultColors['tab.inactiveBackground'];
let tabActiveBackground = defaultColors['tab.activeBackground'];
let tabHoverBackground = defaultColors['tab.hoverBackground'];
let tabActiveBorderTop = defaultColors['tab.activeBorderTop'];
let tabBorder = defaultColors['tab.border'];

let activeTab: 0 | 1 | 2 = 0;

// Add tab functionality
const tabs = document.querySelectorAll<HTMLElement>('#editor-top-bar > .tab');
for (let i = 0; i < tabs.length; i++)
  tabs[i].addEventListener('click', () => setActiveTab(i as 0 | 1 | 2));

function setActiveTab(tab: 0 | 1 | 2) {
  activeTab = tab;
  tabs.forEach((tab, i) => {
    tab.style.borderRight = `1px solid ${rgbaToCSSValue(tabBorder)}`;
    if (i === activeTab) {
      tab.style.borderTop = `2px solid ${rgbaToCSSValue(tabActiveBorderTop)}`;
      tab.style.backgroundColor = rgbaToCSSValue(tabActiveBackground);

      tab.style.borderBottom = `1px solid rgba(0,0,0,0)`;
    } else {
      tab.style.backgroundColor = rgbaToCSSValue(tabBackground);
      tab.style.borderTop = `2px solid rgba(0,0,0,0)`;
      tab.style.borderBottom = `1px solid ${rgbaToCSSValue(tabBorder)}`;
    }
  });

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

setActiveTab(0);

// Apply color theme to tab bar
editor._themeService.onDidColorThemeChange((theme: any) => {
  const colors = theme.colors as Map<string, Color>;

  tabBackground =
    colors.get('tab.inactiveBackground')?.rgba ||
    defaultColors['tab.inactiveBackground'];
  tabActiveBackground =
    colors.get('tab.activeBackground')?.rgba ||
    defaultColors['tab.activeBackground'];

  tabHoverBackground =
    colors.get('tab.hoverBackground')?.rgba ||
    defaultColors['tab.hoverBackground'];

  tabBorder = colors.get('tab.border')?.rgba || defaultColors['tab.border'];

  tabActiveBorderTop =
    colors.get('tab.activeBorderTop')?.rgba ||
    defaultColors['tab.activeBorderTop'];

  const tabBarBackground =
    colors.get('editorGroupHeader.tabsBackground')?.rgba ||
    defaultColors['editorGroupHeader.tabsBackground'];

  document.getElementById('editor-top-bar')!.style.backgroundColor =
    rgbaToCSSValue(tabBarBackground);

  const sideBarBackground =
    colors.get('sideBar.background')?.rgba ||
    defaultColors['sideBar.background'];

  const sideBarBorder =
    colors.get('sideBar.border')?.rgba || defaultColors['sideBar.border'];

  const titleBarBackground =
    colors.get('titleBar.activeBackground')?.rgba ||
    defaultColors['titleBar.activeBackground'];

  const titleBarBorder =
    colors.get('titleBar.border')?.rgba || defaultColors['titleBar.border'];

  const tabs = document.querySelectorAll<HTMLElement>('.tab');
  tabs.forEach((tab, i) => {
    tab.style.borderRight = `1px solid ${rgbaToCSSValue(tabBorder)}`;
    if (i === activeTab) {
      tab.style.borderTop = `2px solid ${rgbaToCSSValue(tabActiveBorderTop)}`;
      tab.style.backgroundColor = rgbaToCSSValue(tabActiveBackground);
      tab.style.borderBottom = `1px solid rgba(0,0,0,0)`;
    } else {
      tab.style.backgroundColor = rgbaToCSSValue(tabBackground);
      tab.style.borderTop = `2px solid rgba(0,0,0,0)`;
      tab.style.borderBottom = `1px solid ${rgbaToCSSValue(tabBorder)}`;
    }
  });
  Array.from(document.querySelectorAll<HTMLElement>('.tab-bar-filler')).forEach(
    (el) => {
      el.style.borderBottom = `1px solid ${rgbaToCSSValue(tabBorder)}`;
    }
  );

  const sideBar = document.getElementById('sidebar')!;

  sideBar.style.backgroundColor = rgbaToCSSValue(sideBarBackground);
  sideBar.style.borderRight = `1px solid ${rgbaToCSSValue(sideBarBorder)}`;

  const titleBar = document.getElementById('title-bar')!;
  titleBar.style.backgroundColor = rgbaToCSSValue(titleBarBackground);
  titleBar.style.borderBottom = `1px solid ${rgbaToCSSValue(titleBarBorder)}`;
});

monaco.editor.setTheme('dark-plus');

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
