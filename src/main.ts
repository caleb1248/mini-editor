import './style.css';
import './jetbrains-mono.css';
import './editor/workers';

import * as monaco from 'monaco-editor';

import { editor } from './editor/editor.main';
import initThemeSelector from './editor/textmate/themes/theme-selector';
import './layout/styles';
import { updatePreview } from './preview';

initThemeSelector(editor);
editor.addAction({
  label: 'Run code',
  id: 'run-code',
  keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
  run() {
    updatePreview();
  },
});
